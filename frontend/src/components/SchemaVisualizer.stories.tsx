import type { Meta, StoryObj } from '@storybook/react';
import SchemaVisualizer from './SchemaVisualizer';
import type { Schema } from '../types/api';

const schema: Schema = {
  tables: [
    {
      name: 'users',
      columns: [
        { name: 'id', dataType: 'int', nullable: false, primaryKey: true },
        { name: 'name', dataType: 'varchar', nullable: false, primaryKey: false },
      ],
      foreignKeys: [],
    },
    {
      name: 'orders',
      columns: [
        { name: 'id', dataType: 'int', nullable: false, primaryKey: true },
        { name: 'user_id', dataType: 'int', nullable: false, primaryKey: false },
      ],
      foreignKeys: [
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id' },
      ],
    },
  ],
};

const meta: Meta<typeof SchemaVisualizer> = {
  title: 'Components/SchemaVisualizer',
  component: SchemaVisualizer,
};
export default meta;

export const Basic: StoryObj<typeof SchemaVisualizer> = {
  args: {
    schema,
  },
};
