import { useState } from 'react'
import { Box, TextField, Typography } from '@mui/material'

export type BlockType = 'literal' | 'class' | 'quantifier'

interface Block {
  id: number
  type: BlockType
  value: string
}

const palette: { label: string; type: BlockType; value: string }[] = [
  { label: 'Literal', type: 'literal', value: 'text' },
  { label: 'Digit', type: 'class', value: '\\d' },
  { label: 'Word', type: 'class', value: '\\w' },
  { label: 'Whitespace', type: 'class', value: '\\s' },
  { label: 'Optional ?', type: 'quantifier', value: '?' },
  { label: 'Zero or more *', type: 'quantifier', value: '*' },
  { label: 'One or more +', type: 'quantifier', value: '+' },
]

const colorMap: Record<BlockType, string> = {
  literal: '#c8e6c9',
  class: '#bbdefb',
  quantifier: '#ffe0b2',
}

export default function RegexBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [testText, setTestText] = useState('')

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain')
    if (!data) return
    const item = JSON.parse(data) as { type: BlockType; value: string }
    setBlocks((prev) => [...prev, { id: Date.now() + Math.random(), ...item }])
  }

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const updateBlock = (id: number, value: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, value } : b)))
  }

  const regexString = blocks.map((b) => b.value).join('')

  let matches: string[] = []
  try {
    if (regexString) {
      const r = new RegExp(regexString, 'g')
      matches = [...testText.matchAll(r)].map((m) => m[0])
    }
  } catch {
    // ignore invalid regex
  }

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ width: 200 }}>
        <Typography variant="h6" gutterBottom>
          Palette
        </Typography>
        {palette.map((item) => (
          <div
            key={item.label}
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData(
                'text/plain',
                JSON.stringify({ type: item.type, value: item.value })
              )
            }
            style={{
              background: colorMap[item.type],
              padding: 4,
              marginBottom: 4,
              cursor: 'grab',
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Workspace
        </Typography>
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{ minHeight: 60, border: '1px dashed #ccc', p: 1 }}
        >
          {blocks.map((b) => (
            <input
              key={b.id}
              value={b.value}
              onChange={(e) => updateBlock(b.id, e.target.value)}
              style={{
                background: colorMap[b.type],
                marginRight: 4,
                border: 'none',
                padding: '2px 4px',
                borderRadius: 4,
              }}
            />
          ))}
        </Box>
        <Typography sx={{ mt: 2 }}>Regex: {regexString}</Typography>
        <TextField
          label="Test text"
          fullWidth
          sx={{ my: 1 }}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
        />
        <Typography>Matches: {matches.join(', ')}</Typography>
      </div>
    </div>
  )
}
