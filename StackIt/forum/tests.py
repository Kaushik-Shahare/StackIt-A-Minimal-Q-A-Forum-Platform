from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Question, Answer, Comment, Tag, Notification

User = get_user_model()

# Create your tests here.
class TagModelTests(TestCase):
    def setUp(self):
        self.tag = Tag.objects.create(name='Python')
        
    def test_tag_creation(self):
        self.assertEqual(self.tag.name, 'Python')
        self.assertEqual(self.tag.slug, 'python')
        
class QuestionModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='password123')
        self.tag = Tag.objects.create(name='Python')
        self.question = Question.objects.create(
            title='Test Question',
            description='This is a test question',
            author=self.user
        )
        self.question.tags.add(self.tag)
        
    def test_question_creation(self):
        self.assertEqual(self.question.title, 'Test Question')
        self.assertEqual(self.question.author, self.user)
        self.assertEqual(self.question.tags.first(), self.tag)
        
    def test_question_str(self):
        self.assertEqual(str(self.question), 'Test Question')
