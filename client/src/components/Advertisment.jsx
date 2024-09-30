import React from 'react'
import './Advertisment.css'
import adv from '../assets/adv.jpg'

function Advertisment() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} className='whole-adv-page'>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }} className='first-line'>
        <div style={{ fontSize: '17px' }}><b>Sponsored</b></div>
        <div style={{ fontSize: '15px' }}><p className="text-sm text-muted-foreground">Create Ad</p></div>
      </div>
      <div style={{ marginTop: "5%", marginBottom: "5%" }}>
        <img src={adv}></img>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '15px' }}>Lakme Cosmetics</div>
          <div style={{ fontSize: '15px' }}><p className="text-sm text-muted-foreground">lakmeindia.com</p></div>
        </div>
        <div style={{ fontSize: '17px', marginTop: "3%" }}>
          <p className="text-sm text-muted-foreground">
            Lakmé is an Indian beauty brand offers a range of products and services.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Advertisment