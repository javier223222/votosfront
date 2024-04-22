"use client"

import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import axios from 'axios'
import { io } from 'socket.io-client'

function Votacion({params}) {
    const [votacion,setVotacion]=useState({})
    const [newcandidatodat,setnewCandidatoDat]=useState({
       nombre:null,apellido:null
    })
    const [newname,setNewName]=useState('')
    const [candidatos,setCandidatos]=useState([])
    const [socket,setSocket]=useState(null)
    const [showeditar,setShowEditar]=useState(false)
    useEffect(()=>{

        axios.get(`http://localhost:3002/api/votacion?id=${params.id}`,{
            headers:{
                "x-access-token":localStorage.getItem('token')
            }
        }).then(res=>{
            console.log(res.data)
            setCandidatos(res.data.candidatoOfVotation)
            setVotacion(res.data)

          
        }).catch(error=>{
            console.log(error);
        })

        const socket=io("http://localhost:3002/votaciones",{
            auth:{
                token:localStorage.getItem('token')
            }
           })
           socket.emit("joinRoom",params.id)
           socket.on("candidato:get",(data)=>{
               setVotacion(data)
               setCandidatos(data.candidatoOfVotation)
           })
           setSocket(socket)

        
        getvotos()
    },[])

    const getvotos = () => {
        setInterval(async()=>{
           let response=await fetch(`http://localhost:3002/api/votacion?id=${params.id}`,{
                headers:{
                    "x-access-token":localStorage.getItem('token')
                }
            })
            let data=await response.json()
           
            setVotacion(data)
            setCandidatos(data.candidatoOfVotation)
        },5000)
       
    }
  return (
    <div>
    {
        showeditar?<div>
        <input onChange={(e)=>{
            setNewName(e.target.value)
        }} defaultValue={votacion.nombre}></input>
         <button onClick={async()=>{
               axios.patch("http://localhost:3002/api/votacion",{
                id:votacion.idvotacion,nombre:newname,descripcion:votacion.descripcion,fechaInicio:votacion.fechaInicio,fechaFin:votacion.fechaFin,isDeleted:false
               },{
                     headers:{
                          "x-access-token":localStorage.getItem('token')
                     }
                
               }).then((response)=>{
                console.log(response.data)
               }).catch((error)=>{
                console.log(error)
               })
               setShowEditar(!showeditar)
        }}>Actualizar</button>
        <button onClick={()=>{
            setShowEditar(!showeditar)
        }}>cancelar</button>
        </div>: <h1 onClick={()=>{
            setShowEditar(!showeditar)
        }}>{votacion.nombre}</h1>
    }

    <div>
        <p>{votacion.descripcion}</p>
    </div>
    <div>

        
        
          {
            
            candidatos.map((candidato,index)=>
                <h3 key={index} >{candidato.candidato.nombre}  {candidato.candidato.apellido}</h3>
    )
          }
    </div>

    <div>
        <p>agregar candidato</p>
        <input onChange={(e)=>{
            setnewCandidatoDat({
                ...newcandidatodat,
                [e.target.name]:e.target.value
            })
        }} name='nombre'></input>
        <input onChange={(e)=>{
            setnewCandidatoDat({
                ...newcandidatodat,
                [e.target.name]:e.target.value
            })
        }} name='apellido'></input>
        <button onClick={(e)=>{
            socket.emit("candidato:create",{
                name:newcandidatodat.nombre,
                apellido:newcandidatodat.apellido,

            },params.id)
        }}>agregar</button>
    </div>
       
    </div>
  )
}



export default Votacion
