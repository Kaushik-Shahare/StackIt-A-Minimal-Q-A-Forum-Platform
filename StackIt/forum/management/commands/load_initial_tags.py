from django.core.management.base import BaseCommand
from forum.models import Tag

class Command(BaseCommand):
    help = 'Load initial tags for the forum'

    def handle(self, *args, **options):
        # Define common programming and technology tags
        tags = [
            {"name": "Python", "description": "Questions about Python programming language"},
            {"name": "JavaScript", "description": "Questions about JavaScript programming language"},
            {"name": "React", "description": "Questions about React library for building user interfaces"},
            {"name": "Django", "description": "Questions about Django web framework"},
            {"name": "Node.js", "description": "Questions about Node.js runtime environment"},
            {"name": "HTML", "description": "Questions about HTML markup language"},
            {"name": "CSS", "description": "Questions about CSS styling language"},
            {"name": "SQL", "description": "Questions about SQL database queries"},
            {"name": "Git", "description": "Questions about Git version control system"},
            {"name": "Docker", "description": "Questions about Docker containerization platform"},
            {"name": "AWS", "description": "Questions about Amazon Web Services"},
            {"name": "DevOps", "description": "Questions about DevOps practices and tools"},
            {"name": "Machine Learning", "description": "Questions about machine learning and AI"},
            {"name": "Data Science", "description": "Questions about data science and analysis"},
            {"name": "API", "description": "Questions about APIs and web services"},
            {"name": "REST", "description": "Questions about RESTful architecture"},
            {"name": "GraphQL", "description": "Questions about GraphQL query language"},
            {"name": "JWT", "description": "Questions about JSON Web Tokens"},
            {"name": "Testing", "description": "Questions about software testing"},
            {"name": "Security", "description": "Questions about security best practices"},
        ]

        # Create tags if they don't exist already
        count = 0
        for tag_data in tags:
            tag, created = Tag.objects.get_or_create(
                name=tag_data["name"],
                defaults={"description": tag_data["description"]}
            )
            if created:
                count += 1
                self.stdout.write(self.style.SUCCESS(f'Created tag: {tag.name}'))
            else:
                self.stdout.write(f'Tag already exists: {tag.name}')

        self.stdout.write(self.style.SUCCESS(f'Successfully created {count} new tags!'))
