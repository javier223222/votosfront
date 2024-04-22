"use client"

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

function AddVotacion(props) {
  const [votacion,setVotacion]=useState({
    nombre:null,descripcion:null,fechaInicio:null,fechaFin:null,isDeleted:false
  })
  const handlecHANGE=(e)=>{
    setVotacion({
      ...votacion,
      [e.target.name]:e.target.value
    })
  }
  const handelsubmit=(e)=>{
    if(votacion.nombre==null || votacion.descripcion==null || votacion.fechaInicio==null || votacion.fechaFin==null){
      alert("llene todos los campos")
      return
    }
     axios.post("http://localhost:3002/api/votacion",{
      nombre:votacion.nombre,descripcion:votacion.descripcion,fechaInicio:new Date(votacion.fechaInicio),fechaFin:new Date(votacion.fechaFin),isDeleted:false
     },{
      headers:{
        "x-access-token":localStorage.getItem('token')
      }
     
     }).then((response)=>{
      console.log(response.data)
     }).catch((error)=>{
      console.log(error)
     }) 
  }
  return (
    
       <div>
      <input name='nombre'  onChange={handlecHANGE}>
      </input>
      <input name='descripcion' onChange={handlecHANGE}>
      </input>
      <input type="date" name='fechaInicio' onChange={handlecHANGE}>
      </input>
      <input type="date" name='fechaFin' onChange={handlecHANGE}>
      </input>
     <button onClick={handelsubmit}>Add votacion</button>
    </div>
  
    
  )
}



export default AddVotacion
