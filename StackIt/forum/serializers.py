from rest_framework import serializers
from .models import Question, Answer, Comment, Tag, Notification
from django.contrib.auth import get_user_model
from django.db.models import Count

User = get_user_model()

class TagSerializer(serializers.ModelSerializer):
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'description', 'question_count']

    def get_question_count(self, obj):
        return obj.questions.count()

class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user serializer for listing authors"""
    class Meta:
        model = User
        fields = ['id', 'email']

class CommentSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)
    # Remove author_id from required fields, we'll set it automatically from request
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at', 'updated_at']
        
    def create(self, validated_data):
        # Set author from the request context
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        return Comment.objects.create(**validated_data)

class AnswerSerializer(serializers.ModelSerializer):
    author = UserMinimalSerializer(read_only=True)
    # Remove author_id from required fields, we'll set it automatically from request
    question_id = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all(),
        required=False,
        write_only=True,
        source='question'
    )
    vote_count = serializers.IntegerField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    is_upvoted = serializers.SerializerMethodField()
    is_downvoted = serializers.SerializerMethodField()
    
    class Meta:
        model = Answer
        fields = ['id', 'content', 'author', 'question_id', 'vote_count', 'created_at', 
                  'updated_at', 'is_accepted', 'comments', 'is_upvoted', 'is_downvoted']
                  
    def get_is_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(id=request.user.id).exists()
        return False
        
    def get_is_downvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.downvotes.filter(id=request.user.id).exists()
        return False
        
    def create(self, validated_data):
        # Set author from the request context
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        return Answer.objects.create(**validated_data)

class QuestionListSerializer(serializers.ModelSerializer):
    """Serializer for listing questions with minimal information"""
    author = UserMinimalSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    answer_count = serializers.IntegerField(read_only=True)
    vote_count = serializers.IntegerField(read_only=True)
    is_answered = serializers.SerializerMethodField()
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'author', 'tags', 'created_at', 
                  'updated_at', 'vote_count', 'answer_count', 'is_answered']
                  
    def get_is_answered(self, obj):
        """Check if the question has an accepted answer"""
        return obj.answers.filter(is_accepted=True).exists()

class QuestionDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed question view"""
    author = UserMinimalSerializer(read_only=True)
    # Remove author_id from required fields, we'll set it automatically from request
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Tag.objects.all(),
        source='tags'
    )
    answers = serializers.SerializerMethodField()
    vote_count = serializers.IntegerField(read_only=True)
    is_upvoted = serializers.SerializerMethodField()
    is_downvoted = serializers.SerializerMethodField()
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'description', 'author', 'tags', 'tag_ids',
                  'created_at', 'updated_at', 'vote_count', 'answers', 
                  'views_count', 'is_upvoted', 'is_downvoted']
        
    def get_answers(self, obj):
        """Get answers sorted by accepted status and votes"""
        answers = obj.answers.all().order_by('-is_accepted', '-created_at')
        request = self.context.get('request')
        return AnswerSerializer(answers, many=True, context={'request': request}).data
        
    def get_is_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(id=request.user.id).exists()
        return False
        
    def get_is_downvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.downvotes.filter(id=request.user.id).exists()
        return False
        
    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        
        # Set author from the request context instead of requiring author_id
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        
        question = Question.objects.create(**validated_data)
        question.tags.set(tags)
        return question
    
    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        if tags is not None:
            instance.tags.set(tags)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'sender', 'message', 
                  'is_read', 'created_at', 'question', 'answer']
        read_only_fields = ['notification_type', 'sender', 'message', 'created_at', 'question', 'answer']
