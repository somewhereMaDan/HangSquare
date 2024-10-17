import React from 'react'
import './Advertisment.css'
import adv from '../assets/adv.jpg'

function Advertisment() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} className='whole-adv-page'>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }} className='first-line'>
        <div className='Sponsored'><b>Sponsored</b></div>
        <div className='create-ad'><p className="text-muted-foreground">Create Ad</p></div>
      </div>
      <div style={{ marginTop: "5%", marginBottom: "5%" }}>
        <img src={adv}></img>
      </div>
      <div>
        <div className='lakme-headers' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '15px' }}>Lakme Cosmetics</div>
          <div className='ad-site'><p className="text-muted-foreground">lakmeindia.com</p></div>
        </div>
        <div className='ad-info'>
          <p className="text-muted-foreground">
            Lakmé is an Indian beauty brand offers a range of products and services.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Advertisment