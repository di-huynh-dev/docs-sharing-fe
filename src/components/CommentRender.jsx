import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { AntDesign, Entypo, Feather } from '@expo/vector-icons'
import { formatDate } from '../utils/helpers'
import { useNavigation } from '@react-navigation/native'

const CommentRender = ({
  comment,
  toggleModalCommentOptions,
  handleLikeComment,
  handleReplyComment,
  toggleModalReply,
  setModalActionsVisible,
  setSelectedCommentId,
  auth,
}) => {
  const navigation = useNavigation()
  return (
    <View key={comment.commentId} className="mt-2 bg-slate-100 p-1 rounded-xl">
      <View className="flex-row items-center border-b border-gray-200 p-1">
        <TouchableOpacity
          onPress={() => navigation.navigate('OtherUserProfileScreen', { user: comment.user })}
          style={{ marginRight: 10 }}
        >
          {comment.user.image ? (
            <Image source={{ uri: comment.user.image }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          ) : (
            <Image
              source={require('../../assets/images/no-avatar.jpg')}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {comment.user.firstName} {comment.user.lastName}
              {/* {comment.user.email === auth.profile.email ? ' (Bạn)' : ''} */}
            </Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>{formatDate(comment.createdAt)}</Text>
          </View>
          <Text style={{ fontSize: 14, marginTop: 5 }}>{comment.content}</Text>
          <View className="flex-row items-center mt-2 space-x-2">
            <TouchableOpacity onPress={() => handleLikeComment(comment.commentId)}>
              <AntDesign name={comment.liked ? 'dislike2' : 'like2'} size={18} color={comment.liked ? 'red' : 'blue'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleModalReply(comment.commentId)}>
              <Entypo name="reply" size={18} color="blue" />
            </TouchableOpacity>
            {comment.user.email === auth.profile.email && (
              <TouchableOpacity onPress={() => toggleModalCommentOptions(comment.commentId)}>
                <Feather name="more-vertical" size={18} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {comment.childComments.length > 0 && (
        <View style={{ marginLeft: 20 }}>
          {/* Render child comments */}
          {comment.childComments.map((childComment) => (
            <CommentRender
              key={childComment.commentId} // Don't forget to add a unique key
              comment={childComment}
              toggleModalCommentOptions={toggleModalCommentOptions}
              handleLikeComment={handleLikeComment}
              handleReplyComment={handleReplyComment}
              toggleModalReply={toggleModalReply}
              setModalActionsVisible={setModalActionsVisible}
              setSelectedCommentId={setSelectedCommentId}
              auth={auth}
            />
          ))}
        </View>
      )}
    </View>
  )
}

export default CommentRender
