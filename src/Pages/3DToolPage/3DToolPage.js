import Toolbar from "../../components/Toolbar"
import ThreeCanvas from "../../components/ThreeCanvas"
import { AppProvider } from "../../context/AppContext"
import Notification from "../../components/Notification.js"
import "./3DToolPage.css"
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

const App = () => {
  return (
    <AppProvider>
        <NavBar />
        <div className="designer-page">
          
      <div className="container">
        <Toolbar />
        <ThreeCanvas />
        <Notification />
      </div>
      </div>
        <Footer />
    </AppProvider>
  )
}

export default App