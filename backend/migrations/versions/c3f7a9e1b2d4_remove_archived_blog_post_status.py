"""remove archived blog post status

Revision ID: c3f7a9e1b2d4
Revises: d4c8d8289ce9
Create Date: 2026-08-12 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c3f7a9e1b2d4'
down_revision = 'd4c8d8289ce9'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("UPDATE blog_posts SET status = 'draft' WHERE status = 'archived'")
    with op.batch_alter_table('blog_posts', schema=None) as batch_op:
        batch_op.alter_column(
            'status',
            existing_type=sa.Enum('draft', 'published', 'archived', name='blog_post_status'),
            type_=sa.Enum('draft', 'published', name='blog_post_status'),
            existing_nullable=False,
            existing_server_default='draft',
        )


def downgrade():
    with op.batch_alter_table('blog_posts', schema=None) as batch_op:
        batch_op.alter_column(
            'status',
            existing_type=sa.Enum('draft', 'published', name='blog_post_status'),
            type_=sa.Enum('draft', 'published', 'archived', name='blog_post_status'),
            existing_nullable=False,
            existing_server_default='draft',
        )
