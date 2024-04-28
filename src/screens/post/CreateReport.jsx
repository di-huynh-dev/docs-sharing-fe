import { View, Text, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AntDesign } from '@expo/vector-icons'
import { SelectList } from 'react-native-dropdown-select-list'
import { TextInput } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'

const CreateReport = ({ route }) => {
  const { postId } = route.params

  const navigation = useNavigation()
  const axiosPrivate = useAxiosPrivate()
  const client = useQueryClient()
  const [typeId, setTypeId] = useState('')
  const [reason, setReason] = useState('')

  const { data: reasons, isLoading: reasonsLoading } = useQuery({
    queryKey: ['ReportReasonsPost'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('reports/types/post')
      return resp.data.data
    },
  })

  const createReportMutation = useMutation({
    mutationFn: async () => {
      if (!typeId || !reason) {
        Toast.show({
          type: 'error',
          text1: 'Vui lòng nhập đầy đủ thông tin',
        })
        return
      }
      const resp = await axiosPrivate.post('reports/post', {
        postId,
        typeId,
        reason,
      })
      return resp
    },
    onSuccess: (resp) => {
      Toast.show({
        type: 'success',
        text1: resp.data.message,
      })
      client.invalidateQueries(['ReportReasonsPost'])
      navigation.goBack()
    },
  })

  if (reasonsLoading) return <ActivityIndicator />

  return (
    <SafeAreaView className="p-2">
      <TouchableOpacity className="flex-row items-center gap-2" onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text className="text-lg font-bold">Báo cáo bài đăng</Text>
      </TouchableOpacity>
      <Text className="text-[#3588f4] font-bold mb-4 mt-2">Lý do báo cáo</Text>
      <SelectList
        placeholder="Chọn lý do báo cáo"
        setSelected={(val) => {
          setTypeId(val)
        }}
        search={false}
        data={reasons.map((val) => ({ value: val.reason, key: val.typeId }))}
        save="key"
        value={typeId}
      />
      <Text className="text-[#3588f4] font-bold mb-4 mt-2">Nội dung báo cáo</Text>
      <TextInput
        className="flex-grow h-20 bg-[#eff8ff] rounded-xl"
        placeholder="Nhập lí do báo cáo"
        onChangeText={setReason}
        value={reason}
      />
      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={createReportMutation.mutate}
          className="mt-4 bg-[#3588f4] w-14 h-14 rounded-full flex-row items-center justify-center"
        >
          <Feather name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default CreateReport
