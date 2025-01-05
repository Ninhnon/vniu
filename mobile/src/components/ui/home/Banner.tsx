import { Image } from "@components/base";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Banner = () => {
    return (
        <Image.Local source="banner" style={styles.container} resizeMode="cover" />
    );
    };
    export default Banner;
    const styles = StyleSheet.create({
        container: {
        width: "100%",
        height: 200,
        },
        
    });