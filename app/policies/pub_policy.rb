class PubPolicy < ApplicationPolicy
  def create?
    @user.admin?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
