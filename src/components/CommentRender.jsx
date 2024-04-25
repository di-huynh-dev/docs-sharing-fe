import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, Modal } from 'react-native'
import { AntDesign, Entypo, Feather } from '@expo/vector-icons'
import { formatDate } from '../utils/helpers'

const CommentRender = (
  comment,
  handleLikeComment,
  handleReplyComment,
  toggleModalReply,
  setModalActionsVisible,
  setSelectedCommentId,
  auth,
  modalActionsVisible,
) => {
  return (
    <View key={comment.commentId} style={{ marginTop: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
        <View style={{ marginRight: 10 }}>
          {comment.user.image ? (
            <Image source={{ uri: comment.user.image }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          ) : (
            <Image
              source={require('../../assets/images/no-avatar.jpg')}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {comment.user.firstName} {comment.user.lastName}
              {comment.user.userId === auth.profile.userId ? ' (Bạn)' : ''}
            </Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>{formatDate(comment.createdAt)}</Text>
          </View>
          <Text style={{ fontSize: 14, marginTop: 5 }}>{comment.content}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <TouchableOpacity onPress={() => handleLikeComment(comment.commentId)}>
              <AntDesign name={comment.liked ? 'dislike2' : 'like2'} size={18} color={comment.liked ? 'red' : 'blue'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleModalReply(comment.commentId)}>
              <Entypo name="reply" size={18} color="blue" />
            </TouchableOpacity>
            {comment.user.userId === auth.profile.userId && (
              <TouchableOpacity onPress={() => setModalActionsVisible(comment.commentId)}>
                <Feather name="more-vertical" size={18} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {comment.childComments.length > 0 && (
        <View style={{ marginLeft: 20 }}>
          {comment.childComments.map((childComment) => (
            <View key={childComment.commentId} style={{ marginTop: 10 }}>
              {CommentRender(
                childComment,
                handleLikeComment,
                handleReplyComment,
                toggleModalReply,
                setModalActionsVisible,
                setSelectedCommentId,
                auth,
                modalActionsVisible,
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default CommentRender
