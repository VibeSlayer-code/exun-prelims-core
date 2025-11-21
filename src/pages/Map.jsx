import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import './Map.css';

function Map() {
  const canvasRef = useRef(null);
  const [districtSafetyStates, setDistrictSafetyStates] = useState({});
  const [activityLog, setActivityLog] = useState([]);
  const [hazardAlerts, setHazardAlerts] = useState([]);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [fromSelected, setFromSelected] = useState('');
  const [toSelected, setToSelected] = useState('');
  const [fromText, setFromText] = useState('From: Select Start');
  const [toText, setToText] = useState('To: Select Destination');
  const [routeInfo, setRouteInfo] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [infoPanelData, setInfoPanelData] = useState({});
  const [totalPopulation, setTotalPopulation] = useState(1061);
  const [activeAlerts, setActiveAlerts] = useState(3);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const roomObjectsRef = useRef({});
  const routeLineRef = useRef(null);
  const targetRotationYRef = useRef(0.8);
  const targetRotationXRef = useRef(0.5);

  const safetyLevels = ["safe", "caution", "danger"];
  const districtNames = ["residential", "agriculture", "industrial", "defense", "expansion"];

  const districts = {
    entrance: { name: "Main Entrance", pop: "--", status: "Active", time: "0 min", danger: "safe", pos: [0, 3, -20] },
    residential: { name: "Residential District", pop: "892 residents", status: "247 homes", time: "12 min", danger: "safe", pos: [-15, 4, -15] },
    agriculture: { name: "Agriculture Zone", pop: "45 farmers", status: "Feeding 1200+", time: "8 min", danger: "safe", pos: [15, 3.5, -15] },
    central: { name: "Central Hub", pop: "Variable", status: "Meeting point", time: "5 min", danger: "safe", pos: [0, 3, 0] },
    industrial: { name: "Industrial Sector", pop: "67 workers", status: "24/7 operations", time: "15 min", danger: "caution", pos: [-15, 4, 15] },
    defense: { name: "Defense Perimeter", pop: "34 guards", status: "Alert: Green", time: "18 min", danger: "caution", pos: [15, 4, 15] },
    expansion: { name: "Expansion Zone", pop: "23 workers", status: "34% complete", time: "25 min", danger: "danger", pos: [0, 3, 20] }
  };

  const colorMap = {
    safe: 0x8654d8,
    caution: 0xc89664,
    danger: 0xc86464
  };

  const locations = [
    { value: "entrance", label: "Main Entrance" },
    { value: "residential", label: "Residential District" },
    { value: "agriculture", label: "Agriculture Zone" },
    { value: "industrial", label: "Industrial Sector" },
    { value: "defense", label: "Defense Perimeter" },
    { value: "central", label: "Central Hub" },
    { value: "expansion", label: "Expansion Zone" }
  ];

  useEffect(() => {
    const initialStates = {};
    districtNames.forEach((name) => {
      const randomLevel = safetyLevels[Math.floor(Math.random() * safetyLevels.length)];
      initialStates[name] = randomLevel;
    });
    initialStates["entrance"] = "safe";
    initialStates["central"] = "safe";
    setDistrictSafetyStates(initialStates);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || Object.keys(districtSafetyStates).length === 0) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 50, 120);

    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(35, 35, 35);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(40, 50, 30);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x8654d8, 0.8, 80);
    pointLight.position.set(0, 20, 0);
    scene.add(pointLight);

    const floorGeometry = new THREE.PlaneGeometry(90, 90, 40, 40);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const vertices = floorGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i + 2] = Math.random() * 0.6 - 0.3;
    }
    floorGeometry.attributes.position.needsUpdate = true;
    floorGeometry.computeVertexNormals();

    const createRoom = (key, x, y, z, width, height, depth, color) => {
      const group = new THREE.Group();
      group.userData = { district: key };

      const wallThickness = 0.5;
      const walls = [
        { w: width, h: height, d: wallThickness, x: 0, y: 0, z: -depth / 2 },
        { w: width, h: height, d: wallThickness, x: 0, y: 0, z: depth / 2 },
        { w: wallThickness, h: height, d: depth, x: -width / 2, y: 0, z: 0 },
        { w: wallThickness, h: height, d: depth, x: width / 2, y: 0, z: 0 }
      ];

      walls.forEach((wall) => {
        const geometry = new THREE.BoxGeometry(wall.w, wall.h, wall.d);
        const material = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7, metalness: 0.3 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(wall.x, wall.y, wall.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { materialRef: material };
        group.add(mesh);

        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x333333, opacity: 0.6, transparent: true }));
        line.position.copy(mesh.position);
        group.add(line);
      });

      const ceilingGeometry = new THREE.BoxGeometry(width, 0.4, depth);
      const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 });
      const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
      ceiling.position.y = height / 2;
      ceiling.castShadow = true;
      group.add(ceiling);

      const labelCanvas = document.createElement("canvas");
      const context = labelCanvas.getContext("2d");
      labelCanvas.width = 512;
      labelCanvas.height = 128;
      context.fillStyle = "#ffffff";
      context.font = "600 42px -apple-system, BlinkMacSystemFont, sans-serif";
      context.textAlign = "center";
      context.fillText(districts[key].name, 256, 75);

      const texture = new THREE.CanvasTexture(labelCanvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(9, 2.2, 1);
      label.position.y = height / 2 + 2.5;
      group.add(label);

      group.position.set(x, y, z);
      scene.add(group);
      roomObjectsRef.current[key] = group;
      return group;
    };

    const createTunnel = (x1, z1, x2, z2, y = 1.5) => {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);

      const geometry = new THREE.BoxGeometry(length, 2.8, 2.8);
      const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 });
      const tunnel = new THREE.Mesh(geometry, material);
      tunnel.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
      tunnel.rotation.y = angle;
      tunnel.castShadow = true;
      tunnel.receiveShadow = true;
      scene.add(tunnel);

      for (let i = 0; i < 2; i++) {
        const pipeGeometry = new THREE.CylinderGeometry(0.15, 0.15, length, 8);
        const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x404040, roughness: 0.4, metalness: 0.6 });
        const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
        pipe.position.set((x1 + x2) / 2, y + 1.6 - i * 0.5, (z1 + z2) / 2);
        pipe.rotation.z = Math.PI / 2;
        pipe.rotation.y = angle;
        scene.add(pipe);
      }
    };

    createRoom("entrance", 0, 3, -20, 6, 6, 6, colorMap[districtSafetyStates["entrance"] || "safe"]);
    createRoom("residential", -15, 4, -15, 10, 8, 10, colorMap[districtSafetyStates["residential"] || "safe"]);
    createRoom("agriculture", 15, 3.5, -15, 9, 7, 9, colorMap[districtSafetyStates["agriculture"] || "safe"]);
    createRoom("central", 0, 3, 0, 8, 6, 8, colorMap[districtSafetyStates["central"] || "safe"]);
    createRoom("industrial", -15, 4, 15, 9, 8, 9, colorMap[districtSafetyStates["industrial"] || "caution"]);
    createRoom("defense", 15, 4, 15, 10, 8, 10, colorMap[districtSafetyStates["defense"] || "caution"]);
    createRoom("expansion", 0, 3, 20, 7, 6, 7, colorMap[districtSafetyStates["expansion"] || "danger"]);

    createTunnel(0, -20, 0, 0);
    createTunnel(-15, -15, 0, 0);
    createTunnel(15, -15, 0, 0);
    createTunnel(-15, 15, 0, 0);
    createTunnel(15, 15, 0, 0);
    createTunnel(0, 0, 0, 20);
    createTunnel(-15, -15, -15, 15);
    createTunnel(15, -15, 15, 15);

    for (let i = 0; i < 35; i++) {
      const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 0.5 + 0.3, 0);
      const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9, metalness: 0.1 });
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(Math.random() * 70 - 35, 0.3, Math.random() * 70 - 35);
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rock.castShadow = true;
      scene.add(rock);
    }

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      if (mouseDown) return;

      mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const allObjects = [];
      Object.values(roomObjectsRef.current).forEach((group) => {
        group.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            allObjects.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(allObjects);

      if (intersects.length > 0) {
        const clickedGroup = intersects[0].object.parent;
        const districtKey = clickedGroup.userData.district;
        if (districtKey && districts[districtKey]) {
          showDistrictInfo(districtKey);
        }
      }
    };

    const handleMouseDown = (e) => {
      mouseDown = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseUp = () => {
      setTimeout(() => (mouseDown = false), 100);
    };

    const handleMouseMove = (e) => {
      if (!mouseDown) return;

      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;

      targetRotationYRef.current += deltaX * 0.005;
      targetRotationXRef.current += deltaY * 0.005;
      targetRotationXRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationXRef.current));

      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1.05 : 0.95;
      camera.position.multiplyScalar(delta);
      camera.position.clampLength(18, 75);
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("wheel", handleWheel);

    const animate = () => {
      requestAnimationFrame(animate);

      const radius = camera.position.length();
      camera.position.x = radius * Math.sin(targetRotationYRef.current) * Math.cos(targetRotationXRef.current);
      camera.position.y = radius * Math.sin(targetRotationXRef.current);
      camera.position.z = radius * Math.cos(targetRotationYRef.current) * Math.cos(targetRotationXRef.current);
      camera.lookAt(0, 3, 0);

      if (roomObjectsRef.current.central) {
        roomObjectsRef.current.central.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener('resize', handleResize);
    };
  }, [districtSafetyStates]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistrictSafetyStates(prev => {
        const newStates = { ...prev };
        const changeProbability = 0.3;

        districtNames.forEach((name) => {
          if (Math.random() < changeProbability) {
            const oldLevel = newStates[name];
            const newLevel = safetyLevels[Math.floor(Math.random() * safetyLevels.length)];

            if (oldLevel !== newLevel) {
              newStates[name] = newLevel;
              addActivityLog(name, oldLevel, newLevel);

              if (newLevel === "danger") {
                addHazardAlert(name);
              }
            }
          }
        });

        return newStates;
      });

      const basePopulation = 1061;
      const variance = Math.floor(Math.random() * 10) - 5;
      setTotalPopulation(basePopulation + variance);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!roomObjectsRef.current || Object.keys(roomObjectsRef.current).length === 0) return;

    Object.keys(roomObjectsRef.current).forEach((key) => {
      if (districtSafetyStates[key]) {
        const newColor = colorMap[districtSafetyStates[key]];
        const group = roomObjectsRef.current[key];

        group.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.userData.materialRef) {
            child.userData.materialRef.color.setHex(newColor);
          }
        });
      }
    });

    const dangerCount = Object.values(districtSafetyStates).filter(s => s === "danger").length;
    setActiveAlerts(dangerCount + 3);
  }, [districtSafetyStates]);

  const addActivityLog = (district, oldLevel, newLevel) => {
    const time = new Date().toLocaleTimeString();
    const message = `${districts[district].name} changed from ${oldLevel} to ${newLevel}`;
    setActivityLog(prev => [{ time, message, level: newLevel }, ...prev.slice(0, 9)]);
  };

  const addHazardAlert = (district) => {
    const hazards = [
      "Structural instability detected",
      "Gas leak reported",
      "Equipment malfunction",
      "Temperature anomaly",
      "Water seepage detected"
    ];

    const hazard = {
      location: districts[district].name,
      description: hazards[Math.floor(Math.random() * hazards.length)]
    };

    setHazardAlerts(prev => [hazard, ...prev.slice(0, 2)]);
  };

  const showDistrictInfo = (key) => {
    const district = districts[key];
    const descriptions = {
      entrance: "Main access point to the catacomb network. Always monitored and secured.",
      residential: "Housing for 892 permanent residents. Features 247 micro-homes built into the walls.",
      agriculture: "Moss farms and mushroom cultivation zones. Feeds over 1,200 people daily.",
      central: "Community gathering point for meetings, social events, and town hall discussions.",
      industrial: "Equipment workshop, shrinking chamber, and medical facility. 24/7 operations.",
      defense: "Strategic watchtowers and emergency escape routes. 34 guards on rotation.",
      expansion: "Active construction zone. Unstable structure. Authorized personnel only."
    };

    setInfoPanelData({
      title: district.name,
      description: descriptions[key] || "No description available.",
      pop: district.pop,
      status: district.status,
      time: district.time,
      danger: districtSafetyStates[key] || district.danger
    });
    setShowInfoPanel(true);
  };

  const focusDistrict = (key) => {
    const district = districts[key];
    if (district && district.pos) {
      const [x, y, z] = district.pos;
      targetRotationYRef.current = Math.atan2(x, z);
      targetRotationXRef.current = Math.atan2(y - 3, Math.sqrt(x * x + z * z));
      showDistrictInfo(key);
    }
  };

  const calculateRoute = () => {
    if (!fromSelected || !toSelected) {
      alert("Please select both start and destination");
      return;
    }

    if (fromSelected === toSelected) {
      alert("Start and destination cannot be the same");
      return;
    }

    const fromSafety = districtSafetyStates[fromSelected] || districts[fromSelected].danger;
    const toSafety = districtSafetyStates[toSelected] || districts[toSelected].danger;

    const overallSafety = fromSafety === "danger" || toSafety === "danger" ? "Danger" :
                          fromSafety === "caution" || toSafety === "caution" ? "Caution" : "Safe";

    const routes = {
      "entrance-residential": { distance: "450m", time: "12 min", path: "Entrance → Central Hub → Residential", warnings: "None" },
      "entrance-agriculture": { distance: "380m", time: "8 min", path: "Entrance → Agriculture", warnings: "None" },
      "entrance-central": { distance: "250m", time: "5 min", path: "Entrance → Central Hub", warnings: "None" },
      "entrance-industrial": { distance: "680m", time: "15 min", path: "Entrance → Central → Industrial", warnings: "Heavy machinery noise. Wear hearing protection." },
      "entrance-defense": { distance: "720m", time: "18 min", path: "Entrance → Central → Defense", warnings: "Security checkpoint active. Have ID ready." },
      "entrance-expansion": { distance: "950m", time: "25 min", path: "Entrance → Central → Expansion", warnings: "Unstable structure. Hard hat required. Travel in groups of 3 or more." },
      "residential-agriculture": { distance: "580m", time: "14 min", path: "Residential → Central → Agriculture", warnings: "None" },
      "residential-central": { distance: "320m", time: "8 min", path: "Residential → Central Hub", warnings: "None" },
      "residential-industrial": { distance: "520m", time: "12 min", path: "Residential → Industrial (direct)", warnings: "Watch for workers during shift changes." },
      "residential-defense": { distance: "680m", time: "16 min", path: "Residential → Central → Defense", warnings: "Announce yourself to security personnel." },
      "residential-expansion": { distance: "850m", time: "22 min", path: "Residential → Central → Expansion", warnings: "Avoid unless emergency. High collapse risk." },
      "agriculture-central": { distance: "290m", time: "7 min", path: "Agriculture → Central Hub", warnings: "None" },
      "agriculture-industrial": { distance: "710m", time: "17 min", path: "Agriculture → Central → Industrial", warnings: "Avoid peak hours (6-8am, 6-8pm)." },
      "agriculture-defense": { distance: "550m", time: "13 min", path: "Agriculture → Defense (direct)", warnings: "None" },
      "agriculture-expansion": { distance: "920m", time: "24 min", path: "Agriculture → Central → Expansion", warnings: "Do not travel alone." },
      "central-industrial": { distance: "420m", time: "10 min", path: "Central → Industrial", warnings: "High noise levels. Bring ear protection." },
      "central-defense": { distance: "440m", time: "11 min", path: "Central → Defense", warnings: "Security checkpoint. Have identification ready." },
      "central-expansion": { distance: "650m", time: "17 min", path: "Central → Expansion", warnings: "Authorization required. Danger zone." },
      "industrial-defense": { distance: "680m", time: "16 min", path: "Industrial → Defense (perimeter)", warnings: "Stay on marked paths." },
      "industrial-expansion": { distance: "580m", time: "14 min", path: "Industrial → Expansion (construction)", warnings: "Extreme danger. Active construction zone." },
      "defense-expansion": { distance: "620m", time: "15 min", path: "Defense → Expansion (outer tunnel)", warnings: "Pest activity reported. Travel with armed escort." }
    };

    const allRoutes = { ...routes };
    Object.keys(routes).forEach((key) => {
      const [start, end] = key.split("-");
      const reverseKey = `${end}-${start}`;
      allRoutes[reverseKey] = {
        ...routes[key],
        path: routes[key].path.split(" → ").reverse().join(" → ")
      };
    });

    const routeKey = `${fromSelected}-${toSelected}`;
    const routeData = allRoutes[routeKey];

    if (routeData) {
      let warningText = routeData.warnings;
      if (overallSafety === "Danger") {
        warningText += " ALERT: Route passes through danger zones. Extreme caution advised.";
      } else if (overallSafety === "Caution") {
        warningText += " Note: Current conditions require heightened awareness.";
      }

      setRouteInfo({
        distance: routeData.distance,
        time: routeData.time,
        danger: overallSafety,
        path: routeData.path,
        warnings: warningText
      });

      visualizeRoute(fromSelected, toSelected);
    } else {
      alert("Route not found. Please try different locations.");
    }
  };

  const visualizeRoute = (from, to) => {
    if (!sceneRef.current) return;

    if (routeLineRef.current) {
      sceneRef.current.remove(routeLineRef.current);
    }

    const fromPos = districts[from]?.pos;
    const toPos = districts[to]?.pos;

    if (fromPos && toPos) {
      const points = [];
      points.push(new THREE.Vector3(fromPos[0], fromPos[1], fromPos[2]));

      if (from !== "central" && to !== "central") {
        const centralPos = districts.central.pos;
        points.push(new THREE.Vector3(centralPos[0], centralPos[1], centralPos[2]));
      }

      points.push(new THREE.Vector3(toPos[0], toPos[1], toPos[2]));

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x8654d8, linewidth: 3, opacity: 0.9, transparent: true });
      routeLineRef.current = new THREE.Line(geometry, material);
      sceneRef.current.add(routeLineRef.current);

      const midPoint = new THREE.Vector3(
        (fromPos[0] + toPos[0]) / 2,
        (fromPos[1] + toPos[1]) / 2 + 5,
        (fromPos[2] + toPos[2]) / 2
      );

      targetRotationYRef.current = Math.atan2(midPoint.x, midPoint.z);
      targetRotationXRef.current = Math.atan2(midPoint.y - 3, Math.sqrt(midPoint.x * midPoint.x + midPoint.z * midPoint.z));
    }
  };

  const districtData = [
    { key: "entrance", name: "Main Entrance", info: "Access Point" },
    { key: "residential", name: "Residential District", info: "Population: 892" },
    { key: "agriculture", name: "Agriculture Zone", info: "Workers: 45" },
    { key: "central", name: "Central Hub", info: "Meeting Point" },
    { key: "industrial", name: "Industrial Sector", info: "24/7 Operations" },
    { key: "defense", name: "Defense Perimeter", info: "Guards: 34" },
    { key: "expansion", name: "Expansion Zone", info: "Under Construction" }
  ];

  return (
    <div className="map-full-container">
      <div className="container-map">
        <div className="sidebar">
          <div className="header">
            <h1>Catacomb Map</h1>
            <p>Real-time monitoring & navigation system for etuniXe</p>
          </div>

          <div className="live-status">
            <div className="live-indicator"></div>
            <div className="live-status-text">
              <strong>Nixun Is Online</strong>
              <span>Last updated: <span>Just now</span></span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="label">Total Population</div>
              <div className="value">{totalPopulation.toLocaleString()}</div>
              <div className="change positive">+12 today</div>
            </div>
            <div className="stat-card">
              <div className="label">Active Alerts</div>
              <div className="value">{activeAlerts}</div>
              <div className="change negative">+1 new</div>
            </div>
          </div>

          <div className="notice-card">
            <strong>Dynamic Safety Alert</strong>
            <p>Conditions change every 30 seconds. Check status before travel.</p>
          </div>

          <div className="section">
            <h3 className="section-title">Route Planner</h3>
            <div className="form-group">
              <div className="custom-dropdown" onClick={(e) => { e.stopPropagation(); setFromDropdownOpen(!fromDropdownOpen); setToDropdownOpen(false); }}>
                <div className={`dropdown-header ${fromDropdownOpen ? 'active' : ''}`}>
                  <span className={fromSelected ? 'selected' : 'placeholder'}>{fromText}</span>
                  <div className="dropdown-arrow">
                    <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                  </div>
                </div>
                <div className={`dropdown-menu ${fromDropdownOpen ? 'active' : ''}`}>
                  {locations.map(loc => (
                    <div key={loc.value} className={`dropdown-item ${fromSelected === loc.value ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setFromSelected(loc.value); setFromText(loc.label); setFromDropdownOpen(false); }}>
                      {loc.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="custom-dropdown" onClick={(e) => { e.stopPropagation(); setToDropdownOpen(!toDropdownOpen); setFromDropdownOpen(false); }}>
                <div className={`dropdown-header ${toDropdownOpen ? 'active' : ''}`}>
                  <span className={toSelected ? 'selected' : 'placeholder'}>{toText}</span>
                  <div className="dropdown-arrow">
                    <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                  </div>
                </div>
                <div className={`dropdown-menu ${toDropdownOpen ? 'active' : ''}`}>
                  {locations.map(loc => (
                    <div key={loc.value} className={`dropdown-item ${toSelected === loc.value ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setToSelected(loc.value); setToText(loc.label); setToDropdownOpen(false); }}>
                      {loc.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button className="button-primary" onClick={calculateRoute}>Calculate Route</button>

            {routeInfo && (
              <div className="route-details active">
                <div className="detail-row">
                  <span className="detail-label">Distance</span>
                  <span className="detail-value">{routeInfo.distance}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Travel Time</span>
                  <span className="detail-value">{routeInfo.time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Safety Level</span>
                  <span className={`detail-value ${routeInfo.danger === "Safe" ? "color-safe" : routeInfo.danger === "Caution" ? "color-caution" : "color-danger"}`}>
                    {routeInfo.danger}
                  </span>
                </div>
                <div className="route-path">
                  <div className="detail-label">Route</div>
                  <div className="detail-value">{routeInfo.path}</div>
                </div>
                <div className="route-warnings">{routeInfo.warnings}</div>
              </div>
            )}
          </div>

          <div className="section">
            <h3 className="section-title">Safety Zones</h3>
            <div className="legend-grid">
              <div className="legend-item">
                <div className="legend-indicator" style={{ background: '#8654d8' }}></div>
                <div className="legend-text">
                  <strong>Safe</strong>
                  <small>Secured and regularly patrolled</small>
                </div>
              </div>
              <div className="legend-item">
                <div className="legend-indicator" style={{ background: '#c89664' }}></div>
                <div className="legend-text">
                  <strong>Caution</strong>
                  <small>Proceed with awareness</small>
                </div>
              </div>
              <div className="legend-item">
                <div className="legend-indicator" style={{ background: '#c86464' }}></div>
                <div className="legend-text">
                  <strong>Danger</strong>
                  <small>Restricted access only</small>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">Districts</h3>
            <div className="district-list">
              {districtData.map(district => {
                const safety = districtSafetyStates[district.key] || districts[district.key].danger;
                return (
                  <div key={district.key} className="district-card" onClick={() => focusDistrict(district.key)}>
                    <h4>
                      <span className={`status-dot status-${safety}`}></span>
                      {district.name}
                    </h4>
                    <p>{district.info} • {safety.charAt(0).toUpperCase() + safety.slice(1)} Zone</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">Recent Activity</h3>
            <div className="activity-feed">
              {activityLog.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="time">{activity.time}</div>
                  <div className="message">{activity.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="map-container">
          <Link to="/" className="back-button">← Back to Home</Link>
          <canvas ref={canvasRef} id="map3d"></canvas>

          <div className="controls-panel">
            <strong>Controls</strong>
            <div>Drag: Rotate view</div>
            <div>Scroll: Zoom in/out</div>
            <div>Click: View details</div>
          </div>

          {showInfoPanel && (
            <div className="info-panel active" onClick={(e) => e.stopPropagation()}>
              <h3>{infoPanelData.title}</h3>
              <p>{infoPanelData.description}</p>
              <div className="info-detail">
                <strong>Population</strong>
                <span>{infoPanelData.pop}</span>
              </div>
              <div className="info-detail">
                <strong>Status</strong>
                <span>{infoPanelData.status}</span>
              </div>
              <div className="info-detail">
                <strong>Travel Time</strong>
                <span>{infoPanelData.time}</span>
              </div>
              <div className={`badge badge-${infoPanelData.danger}`}>{infoPanelData.danger?.toUpperCase()}</div>
            </div>
          )}

          {hazardAlerts.length > 0 && (
            <div className="hazard-overlay active">
              <h4>
                <svg className="warning-icon" viewBox="0 0 24 24" fill="#c86464">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
                Active Hazards
              </h4>
              <div className="hazard-list">
                {hazardAlerts.map((hazard, index) => (
                  <div key={index} className="hazard-item">
                    <div className="location">{hazard.location}</div>
                    <div className="description">{hazard.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Map;
