import api from './api'
import type { Connection, Schema } from '../types/api'

export const getConnections = async (): Promise<Connection[]> => {
  const res = await api.get<Connection[]>('/connections')
  return res.data
}

export const getConnection = async (id: number): Promise<Connection> => {
  const res = await api.get<Connection>(`/connections/${id}`)
  return res.data
}

export const createConnection = async (
  data: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Connection> => {
  const res = await api.post<Connection>('/connections', data)
  return res.data
}

export const extractSchema = async (connectionId: number): Promise<Schema> => {
  const res = await api.post<Schema>(`/connections/${connectionId}/extract-schema`)
  return res.data
}

export const getSchema = async (connectionId: number): Promise<Schema> => {
  const res = await api.get<Schema>(`/connections/${connectionId}/schema`)
  return res.data
}
