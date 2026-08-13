"""add password reset otps table

Revision ID: a4f7e9c21b3d
Revises: e2b6d4f8a1c9
Create Date: 2026-08-13 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a4f7e9c21b3d'
down_revision = 'e2b6d4f8a1c9'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('password_reset_otps',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('admin_id', sa.Integer(), nullable=False),
    sa.Column('otp_hash', sa.String(length=255), nullable=False),
    sa.Column('reset_token_hash', sa.String(length=255), nullable=True),
    sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('attempts', sa.Integer(), nullable=False),
    sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('used_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['admin_id'], ['admins.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    mysql_charset='utf8mb4',
    mysql_collate='utf8mb4_unicode_ci',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('password_reset_otps', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_password_reset_otps_admin_id'), ['admin_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_password_reset_otps_expires_at'), ['expires_at'], unique=False)


def downgrade():
    with op.batch_alter_table('password_reset_otps', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_password_reset_otps_expires_at'))
        batch_op.drop_index(batch_op.f('ix_password_reset_otps_admin_id'))

    op.drop_table('password_reset_otps')
