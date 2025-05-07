import { useAppContext } from "../context/AppContext"

const Notification = () => {
  const { notification } = useAppContext()

  return (
    <div id="notification" className={notification.visible ? "show" : ""}>
      {notification.message}
    </div>
  )
}

export default Notification
