import { useFrame } from "@react-three/fiber";
import { useState, useMemo } from "react";
import { Quaternion, TorusGeometry, Vector3 } from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { planePosition } from "./Plane";

// SOUND EFFECT
import coin from "/audio/coin.mp3";
import useSound from "use-sound";

// asigna valores aleatorios dentro del rango asignado
function randomPoint(scale) {
  return new Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).multiply(scale || new Vector3(1, 1, 1));
}

// el radio de los objetivos
const TARGET_RAD = 0.125;

export function Targets() {
  const [playAudio] = useSound(coin);
  const [targets, setTargets] = useState(() => {
    const arr = [];

    // pasamos las pos de los targets al array
    for (let i = 0; i < 25; i++) {
      arr.push({
        center: randomPoint(new Vector3(4, 1, 4)).add(
          new Vector3(0, 2 + Math.random() * 2, 0)
        ),
        direction: randomPoint().normalize(),
      });
    }

    return arr;
  });

  // CON ESTA FUN HACEMOS RENDER DE LOS TARGETS DE FORMA MAS EFICIENTE
  const geometry = useMemo(() => {
    let geo;

    targets.forEach((target) => {
      const torusGeo = new TorusGeometry(TARGET_RAD, 0.02, 8, 25);
      torusGeo.applyQuaternion(
        new Quaternion().setFromUnitVectors(
          new Vector3(0, 0, 1),
          target.direction
        )
      );
      torusGeo.translate(target.center.x, target.center.y, target.center.z);

      if (!geo) geo = torusGeo;
      else geo = mergeBufferGeometries([geo, torusGeo]);
    });

    return geo;
  }, [targets]);

  // SI EL AVION GOLPEA UN OBJETIVO
  useFrame(() => {
    targets.forEach((target, i) => {
      const v = planePosition.clone().sub(target.center);
      const dist = target.direction.dot(v);
      const projected = planePosition
        .clone()
        .sub(target.direction.clone().multiplyScalar(dist));

      const hitDist = projected.distanceTo(target.center);
      // si la dis es < al valor asignado o al radio del objeto ...=>
      if (hitDist < TARGET_RAD && Math.abs(dist) < 0.05) {
        // ...=> cambia el estado del mismo
        target.hit = true;
        playAudio();
      }
    });

    const atLeastOneHit = targets.find((target) => target.hit);
    if (atLeastOneHit) {
      // filtra y quita los targets con el valor hit
      setTargets(targets.filter((target) => !target.hit));
    }
  });

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial roughness={0.5} metalness={0.5} />
    </mesh>
  );
}
