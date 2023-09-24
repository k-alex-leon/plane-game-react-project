import React from 'react'
import {  useGLTF } from '@react-three/drei'


export function Mountains(props) {
  const { nodes, materials } = useGLTF('./models/mountains.glb')


  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={[514.435, 514.435, 125.856]}>
          <mesh geometry={nodes.Plane_Material001_0.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Plane_Material001_0_1.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Plane_Material001_0_2.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Plane_Material001_0_3.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Plane_Material001_0_4.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Plane_Material001_0_5.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Plane_Material001_0_6.geometry} material={materials['Material.001']} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('./models/mountains.glb')
