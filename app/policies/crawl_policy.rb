class CrawlPolicy < ApplicationPolicy
  def create?
    @user.admin?
  end

  def new?
    create?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
