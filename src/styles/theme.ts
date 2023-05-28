import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: '#F2F4F7',
        fontFamily: "'Outfit', sans-serif"
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    primary:{
      50:'#e6e1fd',
      500:'#6E51F2'
    }, 
    gray: {
      25: '#FCFCFD',
      50: '#F9FAFB',
      100: '#F2F4F7',
      200: '#EAECF0',
      300: '#D0D5DD',
      400: '#98A2B3',
      500: '#667085',
      600: '#475467',
      700: '#344054',
      800: '#1D2939',
      900: '#101828',
    },
    green: {
      900: '#00452D',
      800: '#005534',
      700: '#006E40',
      600: '#008D4E',
      500: '#00AE63',
      400: '#00CE7C',
      300: '#49E69F',
      200: '#92F2BF',
      100: '#C7F9DC',
      50: '#E7FDF2',
    },
    red: {
      900: '#74231C',
      800: '#8C1E1C',
      700: '#B3211E',
      600: '#DE2825',
      500: '#F93C38',
      400: '#FF655F',
      300: '#FF9993',
      200: '#FFC7C4',
      100: '#FFE0DF',
      50: '#FFF1F0',
    },
    yellow: {
      900: '#732915',
      800: '#8E3016',
      700: '#B43E1A',
      600: '#E05C1D',
      500: '#FF8527',
      400: '#FFA733',
      300: '#FFC150',
      200: '#FFD985',
      100: '#FFEDC2',
      50: '#FFFAE9',
    },
  },
});
