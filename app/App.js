import { createStackNavigator, createAppContainer } from "react-navigation";

//Components
import Main from './src/sections/main'
import Login from './src/sections/login'
import Forgot from './src/sections/login/Forgot'
import Profile from './src/sections/profile'
import Edit from './src/sections/profile/Edit'
import ProForm from  './src/sections/login/ProForm'
import ServiceSelect from './src/sections/login/ServiceSelect'
import UserForm from  './src/sections/login/UserForm'
import Verify from  './src/sections/login/Verify'
import Reset from  './src/sections/login/Reset'
import UserSelect from  './src/sections/etc/UserSelect'
import Nav from  './src/sections/event/Nav'
import Gallery from  './src/sections/event'
import Portfolios from  './src/sections/event/Portfolios'
import Pros from  './src/sections/manage/Pros'
import Admins from  './src/sections/manage/Admins'
import Create from  './src/sections/manage/Create'
import AskEvent from  './src/sections/manage/AskEvent'
import SelectSet from  './src/sections/manage/SelectSet'
import RequestDetail from  './src/sections/manage/RequestDetail'
import ObsPage from  './src/sections/manage/ObsPage'
import ClientNav from  './src/sections/manage/Clients'
import SetPros from  './src/sections/manage/SetPros'
import SelectPro from  './src/sections/manage/SelectPro'
import { EventType, EventDuration, EventLevel, EventResult } from  './src/sections/manage/AskSection'

const Navigator = createStackNavigator({
	Login: {
		screen: Login,
		navigationOptions: {
			header: null
		}
	},
	Main: {
		screen: Main,
		navigationOptions: {
			header: null
		}
	},
	Portfolios: {
		screen: Portfolios,
		navigationOptions: {
			header: null
		}
	},
	Gallery: {
		screen: Gallery,
		navigationOptions: {
			header: null
		}
	},
	Profile: {
		screen: Profile,
		navigationOptions: {
			header: null
		}
	},
	Edit: {
		screen: Edit,
		navigationOptions: {
			header: null
		}
	},
	Forgot: {
		screen: Forgot,
		navigationOptions: {
			header: null
		}
	},
	Event: {
		screen: Nav,
		navigationOptions: {
			header: null
		}
	},
	ProForm: {
		screen: ProForm,
		navigationOptions: {
			header: null
		}
	},
	ServiceSelect: {
		screen: ServiceSelect,
		navigationOptions: {
			header: null
		}
	},
	UserForm: {
		screen: UserForm,
		navigationOptions: {
			header: null
		}
	},
	Verify: {
		screen: Verify,
		navigationOptions: {
			header: null
		}
	},
	Reset: {
		screen: Reset,
		navigationOptions: {
			header: null
		}
	},
	UserSelect: {
		screen: UserSelect,
		navigationOptions: {
			header: null
		}
	},
	Admins: {
		screen: Admins,
		navigationOptions: {
			header: null
		}
	},
	Pros: {
		screen: Pros,
		navigationOptions: {
			header: null
		}
	},
	ClientNav: {
		screen: ClientNav,
		navigationOptions: {
			header: null
		}
	},
	Create: {
		screen: Create,
		navigationOptions: {
			header: null
		}
	},
	AskEvent: {
		screen: AskEvent,
		navigationOptions: {
			header: null
		}
	},
	EventType: {
		screen: EventType,
		navigationOptions: {
			header: null
		}
	},
	EventDuration: {
		screen: EventDuration,
		navigationOptions: {
			header: null
		}
	},
	EventLevel: {
		screen: EventLevel,
		navigationOptions: {
			header: null
		}
	},
	EventResult: {
		screen: EventResult,
		navigationOptions: {
			header: null
		}
	},
	SelectSet: {
		screen: SelectSet,
		navigationOptions: {
			header: null
		}
	},
	ObsPage: {
		screen: ObsPage,
		navigationOptions: {
			header: null
		}
	},
	RequestDetail: {
		screen: RequestDetail,
		navigationOptions: {
			header: null
		}
	},
	SetPros: {
		screen: SetPros,
		navigationOptions: {
			header: null
		}
	},
	SelectPro: {
		screen: SelectPro,
		navigationOptions: {
			header: null
		}
	},
})

export default createAppContainer(Navigator)