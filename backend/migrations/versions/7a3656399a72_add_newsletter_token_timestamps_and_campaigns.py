"""add newsletter unsubscribe token, timestamps, and campaigns table

Revision ID: 7a3656399a72
Revises: b209c1911672
Create Date: 2026-07-22 12:00:00.000000

"""
import secrets

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '7a3656399a72'
down_revision = 'b209c1911672'
branch_labels = None
depends_on = None


def upgrade():
    # Step 1: add the new columns as nullable first - newsletter_subscribers
    # is a populated table in production, so a straight NOT NULL/UNIQUE add
    # would fail outright (unsubscribe_token) or fill every row with the same
    # timestamp under a NOT NULL default (created_at/updated_at, which we
    # instead backfill per-row from subscribed_at below).
    with op.batch_alter_table('newsletter_subscribers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('unsubscribe_token', sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(timezone=True), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True))

    # Step 2: backfill existing rows. A single bulk UPDATE can't give every
    # row a distinct random token, so this walks the table in Python instead.
    connection = op.get_bind()
    subscribers_table = sa.table(
        'newsletter_subscribers',
        sa.column('id', sa.Integer),
        sa.column('subscribed_at', sa.DateTime(timezone=True)),
        sa.column('unsubscribe_token', sa.String(length=64)),
        sa.column('created_at', sa.DateTime(timezone=True)),
        sa.column('updated_at', sa.DateTime(timezone=True)),
    )
    rows = connection.execute(sa.select(subscribers_table.c.id, subscribers_table.c.subscribed_at)).fetchall()
    for row in rows:
        connection.execute(
            subscribers_table.update()
            .where(subscribers_table.c.id == row.id)
            .values(
                unsubscribe_token=secrets.token_urlsafe(32),
                created_at=row.subscribed_at,
                updated_at=row.subscribed_at,
            )
        )

    # Step 3: now that every row has a value, lock the columns down.
    with op.batch_alter_table('newsletter_subscribers', schema=None) as batch_op:
        batch_op.alter_column('unsubscribe_token', existing_type=sa.String(length=64), nullable=False)
        batch_op.alter_column('created_at', existing_type=sa.DateTime(timezone=True), nullable=False)
        batch_op.alter_column('updated_at', existing_type=sa.DateTime(timezone=True), nullable=False)
        batch_op.create_index(
            batch_op.f('ix_newsletter_subscribers_unsubscribe_token'), ['unsubscribe_token'], unique=True
        )

    # Step 4: campaign send-history log (Document 5-style audit trail for
    # the Smart Newsletter Recommendation feature) - one row per send.
    op.create_table(
        'newsletter_campaigns',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('subject', sa.String(length=255), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('cta_url', sa.String(length=500), nullable=True),
        sa.Column('cta_label', sa.String(length=80), nullable=True),
        sa.Column('source_type', sa.String(length=40), nullable=True),
        sa.Column('source_id', sa.Integer(), nullable=True),
        sa.Column('sent_by_admin_id', sa.Integer(), nullable=True),
        sa.Column('recipient_count', sa.Integer(), nullable=False),
        sa.Column('success_count', sa.Integer(), nullable=False),
        sa.Column('failure_count', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['sent_by_admin_id'], ['admins.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        mysql_charset='utf8mb4',
        mysql_collate='utf8mb4_unicode_ci',
        mysql_engine='InnoDB',
    )
    with op.batch_alter_table('newsletter_campaigns', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_newsletter_campaigns_sent_by_admin_id'), ['sent_by_admin_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_newsletter_campaigns_created_at'), ['created_at'], unique=False)


def downgrade():
    with op.batch_alter_table('newsletter_campaigns', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_newsletter_campaigns_created_at'))
        batch_op.drop_index(batch_op.f('ix_newsletter_campaigns_sent_by_admin_id'))
    op.drop_table('newsletter_campaigns')

    with op.batch_alter_table('newsletter_subscribers', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_newsletter_subscribers_unsubscribe_token'))
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('unsubscribe_token')
