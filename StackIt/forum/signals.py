from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Answer, Comment, Question, Notification
import re

@receiver(post_save, sender=Answer)
def create_answer_notification(sender, instance, created, **kwargs):
    """Create notification when a new answer is posted"""
    if created:
        # Notify question author
        question = instance.question
        author = question.author
        
        # Don't notify if the question author is the one answering
        if author != instance.author:
            Notification.objects.create(
                recipient=author,
                sender=instance.author,
                notification_type='answer',
                question=question,
                answer=instance,
                message=f"{instance.author.email} answered your question: '{question.title}'"
            )

@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    """Create notification when a new comment is posted"""
    if created:
        answer = instance.answer
        answer_author = answer.author
        
        # Don't notify if the answer author is the one commenting
        if answer_author != instance.author:
            Notification.objects.create(
                recipient=answer_author,
                sender=instance.author,
                notification_type='comment',
                question=answer.question,
                answer=answer,
                comment=instance,
                message=f"{instance.author.email} commented on your answer to '{answer.question.title}'"
            )

@receiver(post_save, sender=Comment)
def create_mention_notification(sender, instance, created, **kwargs):
    """Create notification when a user is mentioned in a comment"""
    if created:
        # Find mentions using regex (@username)
        mentions = re.findall(r'@(\w+)', instance.content)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        for mention in mentions:
            # Try to find mentioned user by username/email
            try:
                mentioned_user = User.objects.get(email__iexact=mention)
                # Don't notify if the user is mentioning themselves
                if mentioned_user != instance.author:
                    Notification.objects.create(
                        recipient=mentioned_user,
                        sender=instance.author,
                        notification_type='mention',
                        question=instance.answer.question,
                        answer=instance.answer,
                        comment=instance,
                        message=f"{instance.author.email} mentioned you in a comment on '{instance.answer.question.title}'"
                    )
            except User.DoesNotExist:
                pass

@receiver(post_save, sender=Answer)
def create_accept_notification(sender, instance, **kwargs):
    """Create notification when an answer is accepted"""
    if instance.is_accepted:
        # Notify answer author
        answer_author = instance.author
        question_author = instance.question.author
        
        # Don't notify if the question author is also the answer author
        if answer_author != question_author:
            Notification.objects.create(
                recipient=answer_author,
                sender=question_author,
                notification_type='accept',
                question=instance.question,
                answer=instance,
                message=f"{question_author.email} accepted your answer to '{instance.question.title}'"
            )
