import { Tab } from '@headlessui/react'
import { Trans, t } from '@lingui/macro'
import { useProjectPageQueries } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectPageQueries'
import { useHasNftRewards } from 'hooks/JB721Delegate/useHasNftRewards'
import { useIsUserAddress } from 'hooks/useIsUserAddress'
import { useOnScreen } from 'hooks/useOnScreen'
import {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'
import { useProjectContext } from '../../hooks/useProjectContext'
import { AboutPanel } from '../AboutPanel/AboutPanel'
import { ActivityPanel } from '../ActivityPanel/ActivityPanel'
import { CyclesPayoutsPanel } from '../CyclesPayoutsPanel/CyclesPayoutsPanel'
import { NftRewardsPanel } from '../NftRewardsPanel/NftRewardsPanel'
import { ProjectUpdatesContext } from '../ProjectUpdatesProvider/ProjectUpdatesProvider'
import { TokensPanel } from '../TokensPanel/TokensPanel'
import { UpdatesPanel } from '../UpdatesPanel/UpdatesPanel'
import { ProjectTab } from '../ui/ProjectTab'

type ProjectTabConfig = {
  id: string
  name: JSX.Element | string
  panel: JSX.Element | string
  hideTab?: boolean
}

export const ProjectTabs = ({ className }: { className?: string }) => {
  const { projectUpdates } = useContext(ProjectUpdatesContext)
  const { projectPageTab, setProjectPageTab } = useProjectPageQueries()
  const { projectOwnerAddress } = useProjectContext()
  const isProjectOwner = useIsUserAddress(projectOwnerAddress)
  const { value: hasNftRewards } = useHasNftRewards()

  const showNftRewards = hasNftRewards

  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const isPanelVisible = useOnScreen(panelRef)
  const [firstRender, setFirstRender] = useState(true)

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false)
      return
    }
    if (
      containerRef.current &&
      !isPanelVisible &&
      projectPageTab !== undefined
    ) {
      containerRef.current.scrollIntoView(true)
    }

    // Intentionally only set - isPanelVisible updates should not cause a
    // re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectPageTab])

  const tabs: ProjectTabConfig[] = useMemo(
    () => [
      { id: 'activity', name: t`Activity`, panel: <ActivityPanel /> },
      { id: 'about', name: t`About`, panel: <AboutPanel /> },
      {
        id: 'nft_rewards',
        name: t`NFTs & Rewards`,
        panel: <NftRewardsPanel />,
        hideTab: !showNftRewards,
      },
      {
        id: 'cycle_payouts',
        name: t`Cycles & Payouts`,
        panel: <CyclesPayoutsPanel />,
      },
      { id: 'tokens', name: t`Tokens`, panel: <TokensPanel /> },
      {
        id: 'updates',
        name: (
          <div className="flex items-center gap-1">
            <Trans>Updates</Trans>
            {!!projectUpdates.length && (
              <TabBadgeCount count={projectUpdates.length} />
            )}
          </div>
        ),
        panel: <UpdatesPanel />,
        hideTab: !isProjectOwner && projectUpdates.length === 0,
      },
    ],
    [showNftRewards, projectUpdates.length, isProjectOwner],
  )

  const selectedTabIndex = useMemo(() => {
    const idx = tabs.findIndex(tab => tab.id === projectPageTab)
    return idx === -1 ? undefined : idx
  }, [projectPageTab, tabs])

  return (
    <div
      ref={containerRef}
      className={twMerge('flex flex-col items-center gap-12', className)}
    >
      <Tab.Group
        as={Fragment}
        selectedIndex={selectedTabIndex}
        defaultIndex={0}
      >
        <div className="fixed top-20 z-10 flex w-full snap-x overflow-x-scroll border-b border-grey-200 bg-white hide-scrollbar dark:border-slate-600 dark:bg-slate-900 sm:justify-center md:static md:z-10 md:justify-center md:pt-8">
          <Tab.List className="flex gap-8">
            {tabs.map(tab => (
              <ProjectTab
                className={twMerge(tab.hideTab && 'hidden')}
                key={tab.id}
                name={tab.name}
                onClick={() => setProjectPageTab(tab.id)}
              />
            ))}
          </Tab.List>
        </div>
        <div ref={panelRef} className="flex w-full justify-center px-4 md:px-0">
          <Tab.Panels as={Fragment}>
            {tabs.map(tab => (
              <Tab.Panel as={Fragment} key={tab.id}>
                {tab.panel}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  )
}

const TabBadgeCount = ({ count }: { count: number }) => (
  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-bluebs-500 text-xs text-white">
    {count}
  </div>
)
