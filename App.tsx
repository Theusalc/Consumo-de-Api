import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ListRenderItemInfo } from 'react-native';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
    image?: string; 
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

// Componente principal para exibir personagens
const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const flatListRef = useRef<FlatList<Character>>(null); // Referência para o FlatList

  // Função para buscar personagens da API
  const fetchCharacters = async (page: number = 1) => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();
      setCharacters(data.results as Character[]); // Atualizando o estado com os personagens
    } catch (error) {
      setError('Erro ao buscar personagens');
      console.error('Erro ao buscar personagens:', error);
    }
  };

  // Usando o hook useEffect para buscar os personagens quando a página mudar
  useEffect(() => {
    fetchCharacters(page);
  }, [page]);

  // Função para rolar para o topo
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [characters]); // Reage às mudanças na lista de personagens

  // Funções para navegação entre páginas
  const goToNextPage = () => setPage(prevPage => prevPage + 1);
  const goToPreviousPage = () => setPage(prevPage => Math.max(prevPage - 1, 1));

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Personagens</Text>
      </View>
      <FlatList
        ref={flatListRef} // Adiciona a referência
        data={characters}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }: ListRenderItemInfo<Character>) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Espécie: {item.species}</Text>
              <Text>Planeta de Origem: {item.origin.name}</Text>
              <Text>Localização: {item.location.name}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={goToPreviousPage}>
          <Text style={styles.buttonText}>Página Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToNextPage}>
          <Text style={styles.buttonText}>Próxima Página</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4CAF50', 
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  originImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 8,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#4CAF50', 
    padding: 10,
    borderRadius: 15,
    width: '45%', 
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
  },
});

export default CharacterList;
