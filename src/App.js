import logo from './logo.svg';
import {DidForm} from './did'
import './App.css';

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>

    <div style={{ marginLeft: '20px', marginTop: '50px' }}>
      <DidForm name={'Alice'}/>
    </div>
    <hr>
    </hr>
    <div style={{ marginRight: '20px', marginTop: '50px' }}>
      <DidForm name={'Bob'}/>
    </div>
      </div>
  )
}

export default App;
