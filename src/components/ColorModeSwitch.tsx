import { HStack,Switch,Text,useColorMode } from '@chakra-ui/react'

const ColorModeSwitch = () => {
    const {toggleColorMode,colorMode}=useColorMode();



  return (
   <HStack>
    <Switch colorScheme='green' isChecked={colorMode==='dark'} onChange={toggleColorMode} position="absolute" right={30}/>
    <Text className='dark-text' position="absolute" right={20}>Dark Mode </Text>
   </HStack>
  )
}

export default ColorModeSwitch   