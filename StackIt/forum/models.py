from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
import uuid

User = get_user_model()

class Tag(models.Model):
    """Model for question tags"""
    name = models.CharField(max_length=30, unique=True)
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class Question(models.Model):
    """Model for questions"""
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()  # Rich text content
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    tags = models.ManyToManyField(Tag, related_name='questions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.PositiveIntegerField(default=0)
    upvotes = models.ManyToManyField(User, related_name='upvoted_questions', blank=True)
    downvotes = models.ManyToManyField(User, related_name='downvoted_questions', blank=True)
    
    @property
    def vote_count(self):
        """Calculate the net vote count"""
        return self.upvotes.count() - self.downvotes.count()
    
    @property
    def answer_count(self):
        """Get the count of answers for this question"""
        return self.answers.count()
    
    def save(self, *args, **kwargs):
        if not self.slug:
            # Create a unique slug based on title
            base_slug = slugify(self.title)
            unique_id = str(uuid.uuid4())[:8]
            self.slug = f"{base_slug}-{unique_id}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']

class Answer(models.Model):
    """Model for answers to questions"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    content = models.TextField()  # Rich text content
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_accepted = models.BooleanField(default=False)
    upvotes = models.ManyToManyField(User, related_name='upvoted_answers', blank=True)
    downvotes = models.ManyToManyField(User, related_name='downvoted_answers', blank=True)
    
    @property
    def vote_count(self):
        """Calculate the net vote count"""
        return self.upvotes.count() - self.downvotes.count()
    
    def __str__(self):
        return f"Answer to: {self.question.title[:50]}"
    
    def save(self, *args, **kwargs):
        # If this answer is being marked as accepted, unmark any previously accepted answer
        if self.is_accepted:
            Answer.objects.filter(question=self.question, is_accepted=True).exclude(id=self.id).update(is_accepted=False)
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-is_accepted', '-created_at']

class Comment(models.Model):
    """Model for comments on answers"""
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Comment by {self.author.email} on {self.answer}"
    
    class Meta:
        ordering = ['created_at']

class Notification(models.Model):
    """Model for user notifications"""
    NOTIFICATION_TYPES = (
        ('answer', 'New Answer'),
        ('comment', 'New Comment'),
        ('mention', 'User Mention'),
        ('accept', 'Answer Accepted'),
    )
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Notification to {self.recipient.email}: {self.message[:50]}"
    
    class Meta:
        ordering = ['-created_at']
