import axios from "axios";
import { motion } from "framer-motion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useParams } from "react-router-dom";
import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import dashboardRoutes from "./routes";

mapboxgl.accessToken =
  "pk.eyJ1Ijoibmh1ZXJ0YXMiLCJhIjoiY2xkZXlxdzZlMDA4bDNubWl4OG9pbHh5OCJ9.4B76e_g-KeCWqICfB4Ry0A";

function ManagerLocations() {
  const mapContainerRef = useRef(null);
  let { cedulaCliente } = useParams();
  const [mapa, setMapa] = useState(null);
  const [searchId, setSearchId] = useState(cedulaCliente);
  const [centro, setCentro] = useState([-76.532, 3.4516]);
  const [escala, setEscala] = useState(12);

  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    setMapa(
      new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v9",
        center: centro,
        zoom: escala,
      })
    );
  }, [centro]);

  useEffect(() => {
    if (!mapa) return;
    if (mapa) addressCoordinates();
  });

  useEffect(() => {
    if (cedulaCliente !== undefined) {
      searchHandler();
    }
  }, []);

  async function addressCoordinates() {
    const response = await axios.get("http://127.0.0.1:8000/api/cliente/");
    //console.log(response.data);
    //console.log(clientes);
    //console.log(aux.data);
    if (response.data.length > 0) {
      response.data?.map(async (client) => {
        try {
          const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${client.direccion.replace(
            /[-#,]/g,
            " "
          )}.json?access_token=${mapboxgl.accessToken}`;
          const response = await fetch(endpoint);
          const result = await response.json();
          //console.log(result?.features[0].geometry.coordinates);
          new mapboxgl.Marker()
            .setLngLat(result?.features[0].geometry.coordinates)
            .addTo(mapa);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  const searchHandler = async (e) => {
    setShow(true);
    await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/usuario/" + searchId + "/",
    })
      .then(async function (responseUser) {
        setUser(responseUser.data);
        await axios({
          method: "get",
          url: "http://127.0.0.1:8000/api/cliente/" + searchId + "/",
        })
          .then(async function (response) {
            const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${response.data.direccion.replace(
              /[-#,]/g,
              " "
            )}.json?access_token=${mapboxgl.accessToken}`;
            const resp = await fetch(endpoint);
            const result = await resp.json();
            setCentro(result?.features[0].geometry.coordinates);
            setEscala(20);
            setShow(false);
          })
          .catch((error) => {
            setNoEncontrado(true);
            setSearchId("");
            setShow(false);
          });
      })
      .catch((error) => {
        setNoEncontrado(true);
        setSearchId("");
        setShow(false);
      });
  };

  return (
    <>
      <div className="wrapper">
        <SidebarUser routes={dashboardRoutes} />

        <div className="contentPage">
          <NavbarOperator />

          <div className="content">
            <div>
              <motion.div
                exit={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                initial={{ opacity: 0, scaleX: 0.9 }}
                className="containerForm"
              >
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="CC del cliente"
                    value={searchId}
                    onChange={(e) => {
                      setSearchId(e.target.value);
                      console.log(searchId);
                    }}
                  />
                  <Button
                    variant="warning"
                    id="button-addon1"
                    onClick={searchHandler}
                  >
                    Buscar
                  </Button>
                </InputGroup>
              </motion.div>
              <div
                className="map-container"
                ref={mapContainerRef}
                style={{
                  width: "calc(100vw - 300px)",
                  height: "calc(100vh - 200px)",
                  marginTop: 10,
                }}
              >
                {addressCoordinates}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerLocations;
