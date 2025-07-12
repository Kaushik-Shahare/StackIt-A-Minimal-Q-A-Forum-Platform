from django.contrib import admin
from .models import Question, Answer, Comment, Tag, Notification

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'question_count')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    
    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Questions'

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'answer_count', 'vote_count')
    list_filter = ('created_at', 'tags')
    search_fields = ('title', 'description', 'author__email')
    readonly_fields = ('slug', 'created_at', 'updated_at', 'views_count')
    filter_horizontal = ('tags', 'upvotes', 'downvotes')
    
    def answer_count(self, obj):
        return obj.answers.count()
    answer_count.short_description = 'Answers'
    
    def vote_count(self, obj):
        return obj.upvotes.count() - obj.downvotes.count()
    vote_count.short_description = 'Votes'

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('answer_preview', 'author', 'question', 'created_at', 'is_accepted', 'vote_count')
    list_filter = ('created_at', 'is_accepted')
    search_fields = ('content', 'author__email', 'question__title')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('upvotes', 'downvotes')
    
    def answer_preview(self, obj):
        if len(obj.content) > 50:
            return obj.content[:50] + '...'
        return obj.content
    answer_preview.short_description = 'Answer'
    
    def vote_count(self, obj):
        return obj.upvotes.count() - obj.downvotes.count()
    vote_count.short_description = 'Votes'

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('comment_preview', 'author', 'answer_preview', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__email', 'answer__content')
    readonly_fields = ('created_at', 'updated_at')
    
    def comment_preview(self, obj):
        if len(obj.content) > 50:
            return obj.content[:50] + '...'
        return obj.content
    comment_preview.short_description = 'Comment'
    
    def answer_preview(self, obj):
        if len(obj.answer.content) > 30:
            return obj.answer.content[:30] + '...'
        return obj.answer.content
    answer_preview.short_description = 'On Answer'

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'notification_type', 'message_preview', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('recipient__email', 'sender__email', 'message')
    readonly_fields = ('created_at',)
    
    def message_preview(self, obj):
        if len(obj.message) > 50:
            return obj.message[:50] + '...'
        return obj.message
    message_preview.short_description = 'Message'
