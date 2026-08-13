import  AppRoutes from './website/routes/AppRoutes'
import { DisclaimerGate } from './website/components/common/DisclaimerGate'
function App() {

  return (
    <>
       <AppRoutes />
       <DisclaimerGate />
    </>
  )
}

export default App
