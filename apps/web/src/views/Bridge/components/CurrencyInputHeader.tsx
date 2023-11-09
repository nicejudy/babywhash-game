import { useTranslation } from '@pancakeswap/localization'
import {
  ChartDisableIcon,
  ChartIcon,
  Flex,
  HistoryIcon,
  HotDisableIcon,
  HotIcon,
  IconButton,
  NotificationDot,
  Swap,
  Text,
  TooltipText,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useAtom } from 'jotai'
import { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useExpertModeManager } from 'state/user/hooks'
import styled from 'styled-components'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

interface Props {
  title: string | ReactElement
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
`

const mobileShowOnceTokenHighlightAtom = atomWithStorageWithErrorCatch('pcs::mobileShowOnceTokenHighlight', false)

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = ({
  subtitle,
  hasAmount,
  onRefreshPrice,
  title,
}) => {
  const { t } = useTranslation()
  const [mobileTooltipShowOnce, setMobileTooltipShowOnce] = useAtom(mobileShowOnceTokenHighlightAtom)
  const [mobileTooltipShow, setMobileTooltipShow] = useState(false)
  const { tooltip, tooltipVisible, targetRef } = useTooltip(<Text>{t('Check out the top traded tokens')}</Text>, {
    placement: isMobile ? 'top' : 'bottom',
    trigger: isMobile ? 'focus' : 'hover',
    ...(isMobile && { manualVisible: mobileTooltipShow }),
  })
  const [expertMode] = useExpertModeManager()
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  const handleOnClick = useCallback(() => onRefreshPrice?.(), [onRefreshPrice])
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()

  const mobileTooltipClickOutside = useCallback(() => {
    setMobileTooltipShow(false)
  }, [])

  useEffect(() => {
    if (isMobile && !mobileTooltipShowOnce) {
      setMobileTooltipShow(true)
      setMobileTooltipShowOnce(true)
    }
  }, [mobileTooltipShowOnce, setMobileTooltipShowOnce])

  useEffect(() => {
    document.body.addEventListener('click', mobileTooltipClickOutside)
    return () => {
      document.body.removeEventListener('click', mobileTooltipClickOutside)
    }
  }, [mobileTooltipClickOutside])

  const titleContent = (
    <Flex width="100%" alignItems="center" justifyContent="space-between" flexDirection="column">
      <Flex flexDirection="row" alignItems="center" width="100%" marginBottom={15}>
        <Swap.CurrencyInputHeaderTitle>{title}</Swap.CurrencyInputHeaderTitle>
      </Flex>
    </Flex>
  )

  return <Swap.CurrencyInputHeader title={titleContent} subtitle={<></>} />
}

export default CurrencyInputHeader