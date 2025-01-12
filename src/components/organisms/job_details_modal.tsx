import { makeStyles } from '@material-ui/styles'
import { BookmarkBorderOutlined } from '@mui/icons-material'
import {
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  Modal,
  Paper,
  Typography,
} from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { companyDefaultImage } from '../../images'
import {
  applyJob,
  fetchAppliesService,
  FetchAupairJobState,
} from '../../services'
import { useSelector } from '../../store'
import { theme } from '../../styles'
import { CopyButton, CustomButton, SkeletonHOC } from '../atoms'
import { MessageModal } from '../molecules'

const useStyles = makeStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    [theme.breakpoints.down('lg')]: {
      padding: '0px',
    },
  },
  jobPaper: {
    padding: 28,
    borderRadius: 10,
    height: 'min-content',
    maxHeight: 'auto',
    zIndex: 999,

    [theme.breakpoints.down('lg')]: {
      margin: '0 240px',
    },

    [theme.breakpoints.down('sm')]: {
      width: '400px',
    },
  },
  urlButton: {
    borderRadius: '3px',
    height: 48,
    backgroundColor: theme.palette.grey[100],
    padding: '10px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  url: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

interface Job {
  job: FetchAupairJobState
  uuid: string
  title: string
  description: string
  tags: string[]
}

interface Props {
  selectedJob: Job
  isFetching: boolean
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  wasApplied: boolean
}

const JobDetailsModal: React.FC<Props> = ({
  open,
  setOpen,
  selectedJob,
  isFetching,
  // wasApplied = false
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const user = useSelector((state) => state.user)
  const [openModal, setOpenModal] = useState(false)
  const [modalStatus, setModalStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const accessToken = sessionStorage.getItem('accessToken')

  const submitJob = async () => {
    setIsLoading(true)

    const payload = {
      jobId: selectedJob.uuid,
      aupairId: user?._id!,
      accessToken: accessToken!,
    }

    const { hasError } = await applyJob(payload)
    if (hasError) {
      setModalStatus('error')
      setOpenModal(true)
      return
    }
    setOpenModal(true)
    setModalStatus('success')

    await fetchAppliesService(user?._id!, accessToken!)
    setIsLoading(false)
  }

  const handleClose = (_event: Record<string, never>) => {
    setOpen && setOpen(false)
  }

  return (
    <Modal
      open={!!open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className={classes.modal}
    >
      <Fade in={!!open}>
        <Paper className={classes.jobPaper} elevation={2}>
          <Box display="flex" width="100%" justifyContent="space-between">
            <Box display="flex" gap={3}>
              <Box>
                <img src={companyDefaultImage} alt="company image" width={56} />
              </Box>
              <Box>
                <Typography fontSize={16} color={theme.palette.grey[600]}>
                  Usuário Novo
                </Typography>
                <SkeletonHOC
                  animation="wave"
                  variant="text"
                  isLoading={isFetching}
                  height={28}
                >
                  <Typography
                    fontSize={18}
                    fontWeight="bold"
                    color={theme.palette.common.black}
                  >
                    {selectedJob?.title}
                  </Typography>
                </SkeletonHOC>
              </Box>
            </Box>

            <IconButton>
              <BookmarkBorderOutlined fontSize="large" color="disabled" />
            </IconButton>
          </Box>

          <Box display="flex" flexDirection="column" gap={1} mt={6}>
            <Typography
              fontSize={16}
              fontWeight="bold"
              color={theme.palette.common.black}
            >
              {t('organisms.job_details.overview')}
            </Typography>

            <SkeletonHOC animation="wave" variant="text" isLoading={isFetching}>
              <Typography fontSize={12} color={theme.palette.grey[700]}>
                {selectedJob?.description}
              </Typography>
            </SkeletonHOC>
          </Box>

          <Box display="flex" flexDirection="column" gap={1} mt={3}>
            <Typography
              fontSize={16}
              fontWeight="bold"
              color={theme.palette.common.black}
            >
              {t('organisms.job_details.job_details')}
            </Typography>
          </Box>
          <Box display="flex" gap={2} mt={1}>
            <SkeletonHOC
              animation="wave"
              variant="rounded"
              height={32}
              width={75}
              isLoading={isFetching}
            >
              <>
                {selectedJob?.tags?.map((tag: string, index) => {
                  return (
                    tag && (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        sx={{
                          borderRadius: '3px',
                          backgroundColor: theme.palette.grey[300],
                          border: 'none',
                        }}
                      />
                    )
                  )
                })}
              </>
            </SkeletonHOC>
          </Box>

          <Box display="flex" flexDirection="column" gap={1} mt={7}>
            {/* <Typography
              fontSize={16}
              fontWeight="bold"
              color={theme.palette.common.black}
            >
              {t('organisms.job_details.profile_detail')}
            </Typography> */}

            {/* <Box display="flex" width="100%" justifyContent="space-between">
              <Box textAlign="justify">
                <Typography
                  fontSize={14}
                  fontWeight="bold"
                  color={theme.palette.common.black}
                >
                  5.00 para 1 avaliação
                </Typography>

                <Box>
                  <Star color="warning" fontSize="inherit" />
                  <Star color="warning" fontSize="inherit" />
                  <Star color="warning" fontSize="inherit" />
                  <Star color="warning" fontSize="inherit" />
                </Box>
              </Box>

              <Box textAlign="justify">
                <Typography
                  fontSize={14}
                  fontWeight="bold"
                  color={theme.palette.common.black}
                >
                  {t('organisms.job_details.locale')}
                </Typography>
                <Typography fontSize={12} color={theme.palette.grey[600]}>
                  Estados Unidos
                </Typography>
              </Box>

              <Box textAlign="justify">
                <Typography
                  fontSize={14}
                  fontWeight="bold"
                  color={theme.palette.common.black}
                >
                  {t('organisms.job_details.timeline')}
                </Typography>
                <Typography fontSize={12} color={theme.palette.grey[600]}>
                  Somente na Semana
                </Typography>
              </Box>
            </Box> */}

            <Box width="100%">
              <SkeletonHOC
                animation="wave"
                variant="text"
                height={40}
                width="100%"
                isLoading={isFetching}
              >
                <CustomButton width="100%" height="48px" onClick={submitJob}>
                  {isLoading ? (
                    <CircularProgress size="18px" color="secondary" />
                  ) : (
                    `Você tem ${selectedJob?.job?.score} de compatibilidade com essa vaga! Se candidate!`
                  )}

                  {/* {wasApplied
              ? 'Cancelar candidatura'
              : t('organisms.job_details.apply')} */}
                </CustomButton>
              </SkeletonHOC>
            </Box>

            <Box
              display="grid"
              gridTemplateColumns="8fr 2fr"
              width="100%"
              mt={4}
            >
              <Box className={classes.urlButton}>
                <Box className={classes.url}>
                  <Typography
                    fontSize={12}
                    color={theme.palette.grey[700]}
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    https://aupamatch.com.br/vaga/abcdefghijklmopqrstuvwxyz1234567891011121314151617181920212223242526272829303132
                  </Typography>
                </Box>
                <CopyButton
                  value={
                    'https://aupamatch.com.br/vaga/abcdefghijklmopqrstuvwxyz1234567891011121314151617181920212223242526272829303132'
                  }
                />
              </Box>

              <CustomButton width="100%" height="48px" onClick={submitJob}>
                {isLoading ? (
                  <CircularProgress size="18px" color="secondary" />
                ) : (
                  t('organisms.job_details.apply')
                )}
                {/* {wasApplied
                  ? 'Cancelar candidatura'
                  : t('organisms.job_details.apply')} */}
              </CustomButton>
            </Box>
          </Box>

          <MessageModal
            success={modalStatus === 'success'}
            error={modalStatus === 'error'}
            open={openModal}
            setOpen={setOpenModal}
            title={t('organisms.job_details.modal_title')}
            subtitle={t('organisms.job_details.modal_subtitle')!}
            secondaryButton={
              <Button onClick={() => {}} color="inherit" variant="contained">
                {t('organisms.job_details.my_profile')}
              </Button>
            }
          />
        </Paper>
      </Fade>
    </Modal>
  )
}

export default JobDetailsModal
