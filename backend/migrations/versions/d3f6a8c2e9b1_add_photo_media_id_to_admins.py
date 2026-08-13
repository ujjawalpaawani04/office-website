"""add photo_media_id to admins

Revision ID: d3f6a8c2e9b1
Revises: c8e1f4a9b2d7
Create Date: 2026-08-13 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd3f6a8c2e9b1'
down_revision = 'c8e1f4a9b2d7'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('admins', schema=None) as batch_op:
        batch_op.add_column(sa.Column('photo_media_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            'fk_admins_photo_media_id_media', 'media', ['photo_media_id'], ['id'], ondelete='SET NULL'
        )


def downgrade():
    with op.batch_alter_table('admins', schema=None) as batch_op:
        batch_op.drop_constraint('fk_admins_photo_media_id_media', type_='foreignkey')
        batch_op.drop_column('photo_media_id')
