import { View, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Button } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { globalStyles } from '../../styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import VerticalItem from '../../components/VerticalItem'
import { SelectList } from 'react-native-dropdown-select-list'

const DocumentSearch = () => {
  const navigation = useNavigation()
  const client = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const [searchQuery, setSearchQuery] = useState('@@@@@')
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedField, setSelectedField] = useState('')
  const [selectTime, setSelectTime] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const { data: results } = useQuery({
    queryKey: ['SearchDocuments'],
    queryFn: async () => {
      setLoading(true)
      try {
        const resp = await axiosPrivate.get(
          '/document/search?page=0&size=100&q=' +
            searchQuery +
            '&categories=' +
            selectedCategory +
            '&fields=' +
            selectedField +
            '&order=' +
            selectTime,
        )
        setLoading(false)
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })
  const { data: docCategories, isLoading: categoryLoading } = useQuery({
    queryKey: ['Categories'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/category/all?page=0&size=100')
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const { data: fields, isLoading: fieldLoading } = useQuery({
    queryKey: ['Fields'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/field/all?page=0&size=100')
        return resp.data.data.content
      } catch (error) {
        console.log(error)
        throw new Error('Failed to fetch posts')
      }
    },
  })

  const resetFilters = () => {
    setSelectedCategory('')
    setSelectedField('')
    setSearchQuery('xxxxxxxasdada12312')
    client.invalidateQueries(['SearchDocuments'])
  }

  if (categoryLoading || fieldLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  const handleSearch = () => {
    client.invalidateQueries(['SearchDocuments'])
  }

  const renderDocumentItem = ({ item }) => {
    return <VerticalItem {...item} />
  }

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View className="mx-2 flex-row items-center justify-between p-2">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DocumentScreen')
          }}
          className="flex-row items-center gap-2"
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text className="text-lg font-bold">Tìm kiếm tài liệu</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between p-5 items-center">
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity onPress={handleSearch}>
            <Feather name="search" size={30} color="gray" />
          </TouchableOpacity>
          <TextInput
            placeholder="| Tìm kiếm.."
            className="text-lg "
            onChangeText={(text) => setSearchQuery(text)}
            onSubmitEditing={handleSearch}
          />
        </View>

        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className="flex-row bg-[#5D56F3] rounded-full items-center py-1 px-3 space-x-2"
        >
          <Ionicons name="filter-circle" size={26} color="white" />
          <Text className="text-white">Bộ lọc</Text>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View className="flex-row justify-between items-center">
          <View>
            <SelectList
              search={false}
              value={selectedCategory}
              placeholder="Danh mục"
              setSelected={(val) => {
                setSelectedCategory(val)
              }}
              data={docCategories.map((item) => ({ value: item.categoryName, key: item.categoryId }))}
              multiple={true}
              save="key"
              containerStyle={{ flex: 1 }}
              onPress={() => {
                if (selectedField.length > 0) {
                  setSelectedField([])
                }
              }}
            />
          </View>
          <View>
            <SelectList
              search={false}
              value={selectedField}
              placeholder="Lĩnh vực"
              setSelected={(val) => {
                setSelectedField(val)
              }}
              data={fields.map((item) => ({ value: item.fieldName, key: item.fieldId }))}
              multiple={true}
              save="key"
              containerStyle={{ flex: 1 }}
              onPress={() => {
                if (selectedCategory.length > 0) {
                  setSelectedCategory([])
                }
              }}
            />
          </View>
          <View>
            <SelectList
              search={false}
              value={selectTime}
              placeholder="Thời gian"
              setSelected={(val) => {
                setSelectTime(val)
              }}
              data={[
                { value: 'Mới nhất', key: 'newest' },
                { value: 'Cũ nhất', key: 'oldest' },
              ]}
              save="key"
              containerStyle={{ flex: 1 }}
            />
          </View>
          <TouchableOpacity onPress={resetFilters} style={{ justifyContent: 'center' }}>
            <AntDesign name="reload1" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}

      {loading || categoryLoading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : results.length > 0 ? (
        <View className="mx-2">
          <FlatList data={results} renderItem={renderDocumentItem} keyExtractor={(item) => item.docId} />
        </View>
      ) : (
        <Text className="text-center mt-10">Không có tài liệu nào được tìm thấy</Text>
      )}
    </SafeAreaView>
  )
}

export default DocumentSearch
