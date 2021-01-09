import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './Home/Home'
import VoiceRoom from './VoiceRoom/VoiceRoom'

import {store} from './Store/store'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/:id">
              <VoiceRoom />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
