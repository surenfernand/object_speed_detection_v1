import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { detectObjects, loadModel } from "../scripts/useObjectDetection";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    loadModel(); // Load model once on mount
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePhoto = async () => {
    console.log("Detecting:");
    const data = await cameraRef.current.takePictureAsync({ base64: true });
    const detections = await sendImageToAPI(data.base64);

    const results = await detectObjects(data.base64);
    console.log("Detected Objects:", results);
  };

  const sendImageToAPI = async (base64) => {
    try {
      const response = await fetch("http://192.168.8.128:5000/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const result = await response.json();
      console.log("Detections:", result);
      return result;
    } catch (err) {
      console.error("Detection failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing={facing} ref={cameraRef}/>

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          {/* <Text style={styles.text}>Flip Camera</Text> */}
          <Button title="Take Photo" onPress={takePhoto} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
