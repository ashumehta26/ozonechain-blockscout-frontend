// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, VStack, HStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from './types';

import useFetch from 'src/api/hooks/useFetch';
import type { ResourceError } from 'src/api/resources';

import { useAppContext } from 'src/shell/app/context';
import { CONTENT_MAX_WIDTH } from 'src/shell/layout/utils';

import IndexingStatusInternalTxs from 'src/slices/chain/indexing-status/IndexingStatusInternalTxs';

import NetworkAddToWallet from 'src/features/web3-wallet/components/NetworkAddToWallet';

import config from 'src/config';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import FooterCookieSettings from './FooterCookieSettings';
import FooterLinkItem from './FooterLinkItem';

const MAX_LINKS_COLUMNS = 4;

const Footer = () => {
  const OZONE_LINKS = [
    {
      icon: 'social/twitter' as const,
      iconSize: '24px',
      text: 'X (ex-Twitter)',
      url: 'https://twitter.com/ozonechain',
    },
    {
      icon: 'social/telegram_filled' as const,
      iconSize: '20px',
      text: 'Telegram',
      url: 'https://t.me/ozonechainofficial',
    },
    {
      icon: 'social/facebook_filled' as const,
      iconSize: '20px',
      text: 'Facebook',
      url: 'https://www.facebook.com/ozonechain',
    },
  ].filter(Boolean);

  const { onionDomain } = useAppContext();

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<
    unknown,
    ResourceError<unknown>,
    Array<CustomLinksGroup>
  >({
    queryKey: [ 'footer-links' ],
    queryFn: async() =>
      fetch(config.shell.footer.links || '', undefined, {
        resource: 'footer-links',
      }),
    enabled: Boolean(config.shell.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ?
    1 :
    Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback(
    (gridArea?: GridProps['gridArea']) => {
      return (
        <Flex
          alignItems="center"
          gridArea={ gridArea }
          flexWrap="wrap"
          justifyContent="flex-start"
          columnGap={ 3 }
          rowGap={ 2 }
          mb={{ base: 5, lg: 10 }}
          _empty={{ display: 'none' }}
        >
          { !config.chain.indexingStatus.intTxs.isHidden && (
            <IndexingStatusInternalTxs/>
          ) }
          { !config.features.multichain.isEnabled && (
            <NetworkAddToWallet source="Footer"/>
          ) }
        </Flex>
      );
    },
    [],
  );

  const renderProjectInfo = React.useCallback(
    (gridArea?: GridProps['gridArea']) => {
      return (
        <Box gridArea={ gridArea }>
          <Flex columnGap={ 2 } textStyle="xs" alignItems="center">
            <span>Powered by Ozone</span>
          </Flex>
          <Text mt={ 3 } fontSize="xs">
            The Ozone blockchain represents a cutting-edge, sovereign
            Proof-Of-Stake (PoS) network designed for exceptional performance
            and scalability.
          </Text>
          { onionDomain && (
            <VStack mt={ 6 } alignItems="start" textStyle="xs" gap={ 1 }>
              <HStack _empty={{ display: 'none' }} columnGap={ 0 }>
                <Text
                  aria-label={ `Also accessible via Tor Browser: ${ onionDomain }` }
                >
                  Also accessible via Tor Browser
                </Text>
                <CopyToClipboard
                  text={ onionDomain }
                  tooltipContent="Copy .onion address to clipboard"
                  ml={ 1 }
                />
              </HStack>
            </VStack>
          ) }
        </Box>
      );
    },
    [ onionDomain ],
  );

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'border.divider',
  };

  const contentProps: GridProps = {
    px: {
      base: 4,
      lg: config.shell.navigation.layout === 'horizontal' ? 6 : 12,
      '2xl': 6,
    },
    py: { base: 4, lg: 8 },
    gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
    columnGap: { lg: '32px', xl: '100px' },
    maxW: `${ CONTENT_MAX_WIDTH }px`,
    m: '0 auto',
  };

  const renderRecaptcha = (gridArea?: GridProps['gridArea']) => {
    if (!config.services.reCaptcha.siteKey) {
      return <Box gridArea={ gridArea }/>;
    }

    return (
      <Box gridArea={ gridArea } textStyle="xs" mt={ 6 }>
        <span>This site is protected by reCAPTCHA and the Google </span>
        <Link href="https://policies.google.com/privacy" external noIcon>
          Privacy Policy
        </Link>
        <span> and </span>
        <Link href="https://policies.google.com/terms" external noIcon>
          Terms of Service
        </Link>
        <span> apply.</span>
      </Box>
    );
  };

  const renderCookieSettings = (gridArea?: GridProps['gridArea']) => {
    if (!config.services.usercentrics) {
      return <Box gridArea={ gridArea }/>;
    }

    return <FooterCookieSettings gridArea={ gridArea }/>;
  };

  if (config.shell.footer.links) {
    return (
      <Box { ...containerProps }>
        <Grid { ...contentProps }>
          <div>
            { renderNetworkInfo() }
            { renderProjectInfo() }
            { renderRecaptcha() }
            { renderCookieSettings() }
          </div>

          <Grid
            gap={{
              base: 6,
              lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8,
              xl: 12,
            }}
            gridTemplateColumns={{
              base: 'repeat(auto-fill, 160px)',
              lg: `repeat(${ colNum }, 135px)`,
              xl: `repeat(${ colNum }, 160px)`,
            }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            { [ { title: 'Ozone', links: OZONE_LINKS }, ...(linksData || []) ]
              .slice(0, colNum)
              .map((linkGroup) => (
                <Box key={ linkGroup.title }>
                  <Skeleton
                    fontWeight={ 500 }
                    mb={ 3 }
                    display="inline-block"
                    loading={ isPlaceholderData }
                  >
                    { linkGroup.title }
                  </Skeleton>
                  <VStack gap={ 1 } alignItems="start">
                    { linkGroup.links.map((link) => (
                      <FooterLinkItem
                        { ...link }
                        key={ link.text }
                        isLoading={ isPlaceholderData }
                      />
                    )) }
                  </VStack>
                </Box>
              )) }
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box { ...containerProps }>
      <Grid
        { ...contentProps }
        gridTemplateAreas={{
          lg: `
          "network links-top"
          "info links-bottom"
          "recaptcha links-bottom"
          "cookie-settings links-bottom"
        `,
        }}
      >
        { renderNetworkInfo({ lg: 'network' }) }
        { renderProjectInfo({ lg: 'info' }) }
        { renderRecaptcha({ lg: 'recaptcha' }) }
        { renderCookieSettings({ lg: 'cookie-settings' }) }

        <Grid
          gridArea={{ lg: 'links-bottom' }}
          gap={ 1 }
          gridTemplateColumns={{
            base: 'repeat(auto-fill, 160px)',
            lg: 'repeat(2, 160px)',
            xl: 'repeat(3, 160px)',
          }}
          gridTemplateRows={{
            base: 'auto',
            lg: 'repeat(3, auto)',
            xl: 'repeat(2, auto)',
          }}
          gridAutoFlow={{ base: 'row', lg: 'column' }}
          alignContent="start"
          justifyContent={{ lg: 'flex-end' }}
          mt={{ base: 8, lg: 0 }}
        >
          { OZONE_LINKS.map((link) => (
            <FooterLinkItem { ...link } key={ link.text }/>
          )) }
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);
