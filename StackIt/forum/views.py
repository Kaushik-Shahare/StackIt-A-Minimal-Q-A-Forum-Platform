from rest_framework import viewsets, status, mixins, generics, filters, serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404

from .models import Question, Answer, Comment, Tag, Notification
from .serializers import (
    QuestionListSerializer, QuestionDetailSerializer, AnswerSerializer, 
    CommentSerializer, TagSerializer, NotificationSerializer
)
from .permissions import IsOwnerOrReadOnly, IsAdminUser

class QuestionViewSet(viewsets.ModelViewSet):
    """ViewSet for questions with different serializers for list and detail"""
    queryset = Question.objects.annotate(
        vote_count=Count('upvotes', distinct=True) - Count('downvotes', distinct=True),
        answer_count=Count('answers', distinct=True)
    )
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    lookup_field = 'id'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['created_at', 'vote_count', 'answer_count', 'views_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return QuestionListSerializer
        return QuestionDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count when question is viewed"""
        instance = self.get_object()
        instance.views_count += 1
        instance.save()
        return super().retrieve(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upvote(self, request, pk=None):
        """Upvote a question"""
        question = self.get_object()
        user = request.user
        
        # If already upvoted, remove upvote (toggle)
        if question.upvotes.filter(id=user.id).exists():
            question.upvotes.remove(user)
            return Response({'status': 'upvote removed'})
        
        # Remove any downvote first
        if question.downvotes.filter(id=user.id).exists():
            question.downvotes.remove(user)
            
        # Add upvote
        question.upvotes.add(user)
        return Response({'status': 'upvoted'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def downvote(self, request, pk=None):
        """Downvote a question"""
        question = self.get_object()
        user = request.user
        
        # If already downvoted, remove downvote (toggle)
        if question.downvotes.filter(id=user.id).exists():
            question.downvotes.remove(user)
            return Response({'status': 'downvote removed'})
        
        # Remove any upvote first
        if question.upvotes.filter(id=user.id).exists():
            question.upvotes.remove(user)
            
        # Add downvote
        question.downvotes.add(user)
        return Response({'status': 'downvoted'})

class AnswerViewSet(viewsets.ModelViewSet):
    """ViewSet for answers"""
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        # If we're accessing through the nested route
        if 'question_pk' in self.kwargs:
            question_id = self.kwargs['question_pk']
        elif 'question_id' in self.kwargs:
            question_id = self.kwargs['question_id']
        else:
            # If we're accessing through the direct route
            return Answer.objects.all().annotate(
                vote_count=Count('upvotes', distinct=True) - Count('downvotes', distinct=True)
            ).order_by('-is_accepted', '-vote_count', '-created_at')
            
        # Filter by question ID
        return Answer.objects.filter(
            question_id=question_id
        ).annotate(
            vote_count=Count('upvotes', distinct=True) - Count('downvotes', distinct=True)
        ).order_by('-is_accepted', '-vote_count', '-created_at')
    
    def perform_create(self, serializer):
        # If question_id is provided in request body, it's already set in validated_data
        if 'question' not in serializer.validated_data:
            # If not in request body, get it from the URL parameter
            if 'question_pk' in self.kwargs:
                question = get_object_or_404(Question, id=self.kwargs['question_pk'])
                serializer.save(author=self.request.user, question=question)
            elif 'question_id' in self.kwargs:
                question = get_object_or_404(Question, id=self.kwargs['question_id'])
                serializer.save(author=self.request.user, question=question)
            else:
                # If neither provided, raise an error
                raise serializers.ValidationError({"question_id": "This field is required."})
        else:
            # Question already set from request body, just set the author
            serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def accept(self, request, question_pk=None, question_id=None, pk=None):
        """Mark an answer as accepted (only by question owner)"""
        answer = self.get_object()
        question = answer.question
        
        # Check if request user is the question owner
        if request.user != question.author:
            return Response(
                {'detail': 'Only the question owner can accept an answer'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Toggle accept status
        answer.is_accepted = not answer.is_accepted
        answer.save()
        
        return Response({'status': 'accepted' if answer.is_accepted else 'unaccepted'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upvote(self, request, question_pk=None, question_id=None, pk=None):
        """Upvote an answer"""
        answer = self.get_object()
        user = request.user
        
        # If already upvoted, remove upvote (toggle)
        if answer.upvotes.filter(id=user.id).exists():
            answer.upvotes.remove(user)
            return Response({'status': 'upvote removed'})
        
        # Remove any downvote first
        if answer.downvotes.filter(id=user.id).exists():
            answer.downvotes.remove(user)
            
        # Add upvote
        answer.upvotes.add(user)
        return Response({'status': 'upvoted'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def downvote(self, request, question_pk=None, question_id=None, pk=None):
        """Downvote an answer"""
        answer = self.get_object()
        user = request.user
        
        # If already downvoted, remove downvote (toggle)
        if answer.downvotes.filter(id=user.id).exists():
            answer.downvotes.remove(user)
            return Response({'status': 'downvote removed'})
        
        # Remove any upvote first
        if answer.upvotes.filter(id=user.id).exists():
            answer.upvotes.remove(user)
            
        # Add downvote
        answer.downvotes.add(user)
        return Response({'status': 'downvoted'})

class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for comments on answers"""
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        answer_param = self.kwargs.get('answer_pk') or self.kwargs.get('answer_id')
        question_param = self.kwargs.get('question_pk') or self.kwargs.get('question_id')
        
        return Comment.objects.filter(
            answer__id=answer_param,
            answer__question__id=question_param
        )
    
    def perform_create(self, serializer):
        answer_param = self.kwargs.get('answer_pk') or self.kwargs.get('answer_id')
        question_param = self.kwargs.get('question_pk') or self.kwargs.get('question_id')
        
        answer = get_object_or_404(
            Answer, 
            id=answer_param,
            question__id=question_param
        )
        serializer.save(author=self.request.user, answer=answer)

class TagViewSet(viewsets.ModelViewSet):
    """ViewSet for tags"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        """Custom permissions: anyone can view, only admins can create/edit/delete"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})
    
    @action(detail=False)
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({'count': count})
