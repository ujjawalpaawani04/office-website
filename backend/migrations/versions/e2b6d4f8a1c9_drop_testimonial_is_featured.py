"""drop testimonial is_featured

Revision ID: e2b6d4f8a1c9
Revises: c3f7a9e1b2d4
Create Date: 2026-08-12 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'e2b6d4f8a1c9'
down_revision = 'c3f7a9e1b2d4'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('testimonials', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_testimonials_is_featured'))
        batch_op.drop_column('is_featured')


def downgrade():
    with op.batch_alter_table('testimonials', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_featured', sa.Boolean(), nullable=False, server_default=sa.false()))
        batch_op.create_index(batch_op.f('ix_testimonials_is_featured'), ['is_featured'], unique=False)
