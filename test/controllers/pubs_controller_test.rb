require 'test_helper'

class PubsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @pub = pubs(:one)
  end

  test "should get index" do
    get pubs_url
    assert_response :success
  end

  test "should get new" do
    get new_pub_url
    assert_response :success
  end

  test "should create pub" do
    assert_difference('Pub.count') do
      post pubs_url, params: { pub: { address: @pub.address, name: @pub.name } }
    end

    assert_redirected_to pub_url(Pub.last)
  end

  test "should show pub" do
    get pub_url(@pub)
    assert_response :success
  end

  test "should get edit" do
    get edit_pub_url(@pub)
    assert_response :success
  end

  test "should update pub" do
    patch pub_url(@pub), params: { pub: { address: @pub.address, name: @pub.name } }
    assert_redirected_to pub_url(@pub)
  end

  test "should destroy pub" do
    assert_difference('Pub.count', -1) do
      delete pub_url(@pub)
    end

    assert_redirected_to pubs_url
  end
end
