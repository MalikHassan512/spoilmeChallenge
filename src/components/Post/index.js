import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View, FlatList } from 'react-native';
import Colors from '../../util/colors';
import styles from './styles';
import { height, width } from 'react-native-dimension'
import defualtImage from '../../assets/images/defaultImage.jpg'
import coin from '../../assets/images/coin.png'
import hamburger from '../../assets/images/hamburger.png'
import mysteryBox from '../../assets/images/mysteryBox.png'
import yoga from '../../assets/images/yoga.png'
import soda from '../../assets/images/soda.png'
import mapDummy from '../../assets/images/mapDummy.png'

const Post = ({
    description = `Its Maria's birthday today! Spoil her!`,
    postType = 'SPOIL',
    name = 'Maria Pablos',
    image
}) => {
    console.log("image",image)
    const [spoils, setSpoils] = useState(['soda', 'burger', 'coin', 'yoga', 'chest'])
    const renderItems = ({ item }) => {
        let image = null
        switch (item) {
            case 'soda':
                image = soda
                break
            case 'burger':
                image = hamburger
                break
            case 'coin':
                image = coin
                break
            case 'yoga':
                image = yoga
                break
            case 'chest':
                image = mysteryBox
                break
        }
        return (
            <TouchableOpacity activeOpacity={0.7} style={styles.spoilContainer}>
                <Image source={image} style={styles.image} />
            </TouchableOpacity>
        )
    }
    return (
        <View styles={styles.container}>
            <View style={styles.userInfo}>
                <Image source={defualtImage} style={styles.avatar} />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.time}>2 hrs ago</Text>
                </View>
            </View>
            <View style={styles.post}>
                {postType == 'SPOIL' ?
                    <>
                        <Text style={styles.description}>{description}</Text>
                        <FlatList
                            horizontal
                            data={spoils}
                            style={styles.flatlist}
                            renderItem={renderItems}
                            keyExtractor={item => item}
                        />
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.postBtn}>
                            <Text style={styles.btnText}>Find a Spoil</Text>
                        </TouchableOpacity>
                    </> :
                   postType == 'Post' ?
                   <Image source={{uri:image}} style={styles.mapImage} />
                   : 
                    <View>
                        <Image source={mapDummy} style={styles.mapImage} />
                    </View>
                }
            </View>
        </View>
    );
};

export default Post;
