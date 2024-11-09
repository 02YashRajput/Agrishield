
import DashboardVideo from  "../assets/Dashboard_bg.mp4"
const Background = () => {


  return (
<>
<div className="absolute w-full ">

<video className="h-screen w-full object-cover" autoPlay loop muted>
            <source src={DashboardVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
</div>
</>
  )
}

export default Background