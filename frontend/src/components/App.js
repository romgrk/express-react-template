import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useSelector } from 'react-redux'
import Navbar from './navbar/Navbar';
import routes from './routes'
import './App.css';

function App() {
  const user = useSelector(s => s.auth.user)

  return (
    <Router>
      <div className='App'>
        <Navbar />

        <Switch>
          {routes.list.map(r =>
            <Route
              key={r.path}
              path={r.path}
              render={() => {
                const result = r.if(user)
                if (result)
                  return result
                return r.render()
              }}
            />
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
