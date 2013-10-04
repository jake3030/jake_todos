class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :todos

  validates_presence_of :first_name
  validates_presence_of :last_name


  def as_json(opts = {})
    super opts.reverse_merge({
      :except => [
        :user_id,
        :updated_at
      ]
    })
  end

end
