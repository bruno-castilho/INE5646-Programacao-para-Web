import {
  Box,
  Button,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material'
import { Card } from '../../components/Card'
import { Save, PlayArrow } from '@mui/icons-material'
import { useRef, useContext, useState } from 'react'
import { editor } from 'monaco-editor'
import { VSEditor } from '../../components/VSEditor'
import { AlertContext } from '../../context/AlertContext'
import { useMutation, useQuery } from '@tanstack/react-query'
import { files } from '../../api/files'
import axios from 'axios'
import NewFileDialog from '../../components/NewFileDialog'
import { useNavigate, useParams } from 'react-router-dom'
import { socket } from '../../lib/socket.io'

function waitForResponse(eventName: string): Promise<{ logs: string }> {
  return new Promise((resolve) => {
    socket.once(eventName, (data) => {
      resolve(data)
    })
  })
}

export function Editor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [isPendingResponse, setIsPendingResponse] = useState<boolean>(false)
  const [logs, setLogs] = useState<string>(
    'Clique no botão Executar para ver a saída.',
  )
  const { error, success } = useContext(AlertContext)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const { data, isPending: isPendingFetch } = useQuery({
    queryKey: ['file', id],
    queryFn: async () => {
      if (id) return await files.downloadFile({ fileId: id })
    },
  })

  const { mutateAsync: createFn } = useMutation({
    mutationFn: async ({ file }: { file: Blob }) =>
      await files.createFile({ file }),
    onSuccess: (data) => {
      success(data.message)
      navigate(`/editor/${data.fileId}`)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  const { mutateAsync: updateFn } = useMutation({
    mutationFn: async ({ file, fileId }: { file: Blob; fileId: string }) =>
      await files.updateFile({ file, fileId }),
    onSuccess: (data) => {
      success(data.message)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  function handleOpenNewFileDialog() {
    setOpen(true)
  }
  function handleCloseNewFileDialog() {
    setOpen(false)
  }

  async function handleUpload() {
    if (editorRef.current) {
      const file = new File(
        [editorRef.current.getValue()],
        data?.filename ?? 'sem-nome.php',
        {
          type: 'text/php',
        },
      )

      updateFn({ file, fileId: id ?? '' })
    }
  }

  async function handleNewFile(filename: string) {
    if (editorRef.current) {
      const file = new File([editorRef.current.getValue()], filename, {
        type: 'text/php',
      })

      createFn({ file })
    }
  }

  async function handleSaveCode() {
    if (id) return handleUpload()

    handleOpenNewFileDialog()
  }

  async function handleCodeExecution() {
    try {
      if (!editorRef.current) return

      const script = editorRef.current.getValue()

      socket.emit('run-php-script', {
        script,
      })
      setIsPendingResponse(true)
      const response = await waitForResponse('response-run-php-script')
      console.log(response.logs)
      setLogs(response.logs)
      setIsPendingResponse(false)
    } catch {
      setIsPendingResponse(false)
    }
  }

  return (
    <>
      <Box component={Card} variant="outlined" maxWidth="1488px">
        <CardHeader
          action={
            <>
              <Button
                onClick={handleSaveCode}
                startIcon={<Save />}
                sx={{ color: 'text.primary', textTransform: 'none' }}
                disabled={isPendingFetch}
              >
                Salvar
              </Button>
              <Button
                onClick={handleCodeExecution}
                startIcon={<PlayArrow />}
                sx={{ color: 'text.primary', textTransform: 'none' }}
                disabled={isPendingFetch}
              >
                Executar
              </Button>
            </>
          }
          subheader={
            !isPendingFetch ? (
              <Typography
                variant="subtitle1"
                component="h1"
                color="text.primary"
              >
                {data?.filename ?? 'sem-nome.php'}
              </Typography>
            ) : (
              <Skeleton component="h1" color="text.primary"></Skeleton>
            )
          }
        />
        <Divider />
        <CardContent>
          <VSEditor
            isDarkMode={isDarkMode}
            ref={editorRef}
            value={data?.file}
          />
        </CardContent>
        <Divider />
        <CardContent>
          <Typography variant="subtitle1" component="p" color="text.primary">
            Output:
          </Typography>
          <Box height="20vh" overflow="auto">
            {!isPendingResponse && (
              <Typography variant="body2" component="pre" color="text.primary">
                {logs}
              </Typography>
            )}
            {isPendingResponse && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100%"
              >
                <CircularProgress color="secondary" size={96} />
              </Box>
            )}
          </Box>
        </CardContent>
      </Box>
      <NewFileDialog
        open={open}
        handleNewFile={handleNewFile}
        handleClose={handleCloseNewFileDialog}
      />
    </>
  )
}
