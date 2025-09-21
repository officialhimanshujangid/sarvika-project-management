import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
function PrivateRoute({ element }) {
  const navigate = useNavigate();
    const {isAuthenticated} = useSelector(state=>state.auth)
  useEffect(() => {
    let login = isAuthenticated
    if (!login) {
      navigate('/login');
    }
   }, []);

  return <>{element}</>;
}
export default PrivateRoute;