from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

router = DefaultRouter()
router.register('questions', views.QuestionViewSet)
router.register('tags', views.TagViewSet)
router.register('notifications', views.NotificationViewSet, basename='notification')
router.register('direct-answers', views.AnswerViewSet, basename='direct-answer')

# Create nested routers for answers within questions, using pk instead of slug
question_router = routers.NestedSimpleRouter(router, 'questions', lookup='question')
question_router.register('answers', views.AnswerViewSet, basename='answer')

# Create nested routers for comments within answers
answer_router = routers.NestedSimpleRouter(question_router, 'answers', lookup='answer')
answer_router.register('comments', views.CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(question_router.urls)),
    path('', include(answer_router.urls)),
]
