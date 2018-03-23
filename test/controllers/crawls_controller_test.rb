require 'test_helper'

class CrawlsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get crawls_index_url
    assert_response :success
  end

  test "should get show" do
    get crawls_show_url
    assert_response :success
  end

  test "should get new" do
    get crawls_new_url
    assert_response :success
  end

  test "should get create" do
    get crawls_create_url
    assert_response :success
  end

  test "should get update" do
    get crawls_update_url
    assert_response :success
  end

  test "should get edit" do
    get crawls_edit_url
    assert_response :success
  end

  test "should get destroy" do
    get crawls_destroy_url
    assert_response :success
  end

end
