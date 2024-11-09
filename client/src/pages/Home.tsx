import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url:string) => axios.get(url).then(res => res.data);
const Home = () => {
  // const { data, error } = useSWR('/api/data-endpoint', fetcher);
  
  return (
    <div>
      

    </div>
  )
}

export default Home