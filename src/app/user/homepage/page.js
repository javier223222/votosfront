"use client"

import { Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function HomePage() {
    
    const router=useRouter()
    const [votaciones,setVotaciones]=useState([])
    const [socket,setSocket]=useState(null)
    const [token,setToken]=useState(null);
    useEffect(()=>{
     

  

        setToken(localStorage.getItem('token'));
        axios.get(`http://localhost:3002/api/votacion/client`,{
            headers:{
                "x-access-token":localStorage.getItem('token')
            }
        }).then(res=>{
            setVotaciones(res.data);
            
        
        }).catch(error=>{
            console.log(error);
        })
        nuevosMensajes()
    },[])
    const nuevosMensajes=()=>{
        let nuevoMensaje=[]
        axios.get(`http://localhost:3002/api/votacion/client/new`,{
         headers:{
          "x-access-token":localStorage.getItem("token")
         }
       }).then((data)=>{
        nuevoMensaje=data.data
        
       }).finally(()=>{
        console.log(nuevoMensaje)
        setVotaciones(nuevoMensaje)
        nuevosMensajes()
       })
    
    
      }
  return (
    <div>
    <Grid sx={{ flexGrow:10}} container spacing={2}>

      <Grid item xs={12}>

      
        <Grid container justifyContent="center" spacing={12}>
        {

         votaciones.map((subasta,index)=>{
          return  <Grid key={index} item> <Link href={`homepage/${subasta.idvotacion}`}><Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
       
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
           {subasta.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {subasta.descripcion}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>  </Link></Grid>
         }) 
        }
        </Grid>
    

  
        </Grid>
</Grid>

        
    </div>
  );
}